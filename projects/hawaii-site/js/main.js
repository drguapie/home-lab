// Track which Polaroid is currently on top.
        let highestZIndex = 1;

        // Store the Polaroids so we can arrange them after loading.
        let polaroids = [];

        // Track whether a photograph is being dragged.
        let activeDrag = false;


        // ==========================================
        // RANDOM POLAROID POSITIONING
        // ==========================================

        function arrangePolaroids() {

            const container =
                document.getElementById("memories");

            if (polaroids.length === 0) {
                return;
            }

            // Measure the first Polaroid after it has been
            // added to the page.
            const cardWidth = polaroids[0].element.offsetWidth;
            const cardHeight = polaroids[0].element.offsetHeight;

            const containerWidth = container.clientWidth;

            // Leave space around the gallery edges.
            const margin = 20;

            const availableWidth =
                Math.max(cardWidth, containerWidth - margin * 2);

            // Allow neighboring photographs to overlap slightly.
            const horizontalSpacing = cardWidth * 0.82;
            const verticalSpacing = cardHeight * 0.82;

            // Calculate how many photographs fit across.
            const columns = Math.max(
                1,
                Math.floor(
                    (availableWidth - cardWidth) /
                    horizontalSpacing
                ) + 1
            );

            const rows = Math.ceil(polaroids.length / columns);

            // Center the arrangement inside the gallery.
            const gridWidth =
                cardWidth + (columns - 1) * horizontalSpacing;

            const startX = Math.max(
                0,
                (containerWidth - gridWidth) / 2
            );

            // Give the gallery enough height for all rows.
            container.style.height =
                Math.ceil(
                    rows * verticalSpacing +
                    cardHeight * 0.4 +
                    margin * 2
                ) + "px";

            polaroids.forEach((item, index) => {

                const column = index % columns;
                const row = Math.floor(index / columns);

                // Small random offsets create a scattered look.
                const randomX = (Math.random() - 0.5) * 24;
                const randomY = (Math.random() - 0.5) * 24;

                let x =
                    startX +
                    column * horizontalSpacing +
                    randomX;

                let y =
                    margin +
                    row * verticalSpacing +
                    randomY;

                // Keep photographs within the gallery width.
                x = Math.max(
                    0,
                    Math.min(x, containerWidth - cardWidth)
                );

                y = Math.max(0, y);

                // Store the actual starting coordinates.
                item.currentX = x;
                item.currentY = y;

                // Absolute positioning allows overlapping.
                item.element.style.position = "absolute";
                item.element.style.left = x + "px";
                item.element.style.top = y + "px";

            });

        }


        // ==========================================
        // LOAD MEMORIES FROM FLASK
        // ==========================================

        async function loadMemories() {

            const memoriesContainer =
                document.getElementById("memories");

            try {

                const response = await fetch("/api/memories");

                if (!response.ok) {
                    throw new Error("Failed to load memories");
                }

                const data = await response.json();

                // Clear existing memories.
                memoriesContainer.replaceChildren();

                polaroids = [];

                data.memories.forEach(memory => {

                    // Create the Polaroid frame.
                    const memoryElement =
                        document.createElement("div");

                    memoryElement.className = "polaroid";

                    // Make the Polaroid keyboard accessible.
                    memoryElement.tabIndex = 0;

                    memoryElement.setAttribute(
                        "role",
                        "button"
                    );

                    memoryElement.setAttribute(
                        "aria-label",
                        "Open memory: " +
                        (memory.title || "Untitled Memory")
                    );

                    // Store position and dragging information
                    // for this individual photograph.
                    const item = {
                        element: memoryElement,
                        currentX: 0,
                        currentY: 0,
                        startX: 0,
                        startY: 0,
                        initialX: 0,
                        initialY: 0,
                        isDragging: false,
                        hasMoved: false
                    };

                    const dragThreshold = 5;


                    // ==========================================
                    // POLAROID DRAGGING
                    // ==========================================

                    memoryElement.addEventListener(
                        "pointerdown",
                        event => {

                            // Only respond to the primary mouse button.
                            if (
                                event.pointerType === "mouse" &&
                                event.button !== 0
                            ) {
                                return;
                            }

                            // Record where the pointer started.
                            item.startX = event.clientX;
                            item.startY = event.clientY;

                            // Record the photograph's position.
                            item.initialX = item.currentX;
                            item.initialY = item.currentY;

                            item.isDragging = true;
                            item.hasMoved = false;

                            activeDrag = true;

                            // Bring this photograph to the front.
                            highestZIndex++;

                            memoryElement.style.zIndex =
                                highestZIndex;

                            // Continue receiving pointer events
                            // even when the pointer leaves the photo.
                            memoryElement.setPointerCapture(
                                event.pointerId
                            );

                        }
                    );


                    memoryElement.addEventListener(
                        "pointermove",
                        event => {

                            if (!item.isDragging) {
                                return;
                            }

                            // Calculate total movement from
                            // where dragging originally began.
                            const deltaX =
                                event.clientX - item.startX;

                            const deltaY =
                                event.clientY - item.startY;

                            // Ignore tiny movements from clicks.
                            if (
                                Math.abs(deltaX) > dragThreshold ||
                                Math.abs(deltaY) > dragThreshold
                            ) {
                                item.hasMoved = true;
                            }

                            if (item.hasMoved) {

                                // Add pointer movement to the
                                // photograph's original position.
                                item.currentX =
                                    item.initialX + deltaX;

                                item.currentY =
                                    item.initialY + deltaY;

                                memoryElement.style.left =
                                    item.currentX + "px";

                                memoryElement.style.top =
                                    item.currentY + "px";

                            }

                        }
                    );


                    memoryElement.addEventListener(
                        "pointerup",
                        () => {

                            item.isDragging = false;
                            activeDrag = false;

                        }
                    );


                    memoryElement.addEventListener(
                        "pointercancel",
                        () => {

                            item.isDragging = false;
                            item.hasMoved = false;
                            activeDrag = false;

                        }
                    );


                    // ==========================================
                    // POLAROID PHOTOGRAPH
                    // ==========================================

                    if (memory.image_path) {

                        const photo =
                            document.createElement("img");

                        photo.src = memory.image_path;
                        photo.alt =
                            memory.title || "Hawaii memory";

                        photo.className = "memory-image";

                        // Disable the browser's native
                        // image dragging behavior.
                        photo.draggable = false;

                        memoryElement.appendChild(photo);

                    } else {

                        const placeholder =
                            document.createElement("div");

                        placeholder.className =
                            "photo-placeholder";

                        placeholder.textContent =
                            "No photograph";

                        memoryElement.appendChild(placeholder);

                    }


                    // ==========================================
                    // OPEN EXPANDED MEMORY
                    // ==========================================

                    memoryElement.addEventListener(
                        "click",
                        () => {

                            // Dragging should not open a memory.
                            if (item.hasMoved) {

                                item.hasMoved = false;
                                return;

                            }

                            openMemory(memory);

                        }
                    );


                    // Allow keyboard users to open memories.
                    memoryElement.addEventListener(
                        "keydown",
                        event => {

                            if (
                                event.key === "Enter" ||
                                event.key === " "
                            ) {

                                event.preventDefault();
                                openMemory(memory);

                            }

                        }
                    );


                    // Add the Polaroid to the gallery.
                    memoriesContainer.appendChild(memoryElement);

                    // Keep its position information.
                    polaroids.push(item);

                });


                // Scatter the photographs after they have
                // all been added to the page.
                arrangePolaroids();

            } catch (error) {

                console.error(
                    "Failed to load memories:",
                    error
                );

                memoriesContainer.textContent =
                    "Unable to load memories. Please try again later.";

            }

        }


        // ==========================================
        // EXPANDED MEMORY OVERLAY
        // ==========================================

        function openMemory(memory) {

            const overlay = document.createElement("div");
            overlay.className = "memory-overlay";

            const details = document.createElement("div");
            details.className = "memory-details";

            details.setAttribute("role", "dialog");
            details.setAttribute("aria-modal", "true");

            details.setAttribute(
                "aria-label",
                memory.title || "Memory details"
            );

            // Remember which element was selected.
            const previousFocus = document.activeElement;


            // Create the close button.
            const closeButton =
                document.createElement("button");

            closeButton.className = "close-memory";
            closeButton.textContent = "×";

            closeButton.setAttribute(
                "aria-label",
                "Close memory"
            );


            // Close the expanded memory.
            function closeMemory() {

                document.removeEventListener(
                    "keydown",
                    handleEscape
                );

                overlay.remove();

                // Return keyboard focus to the Polaroid.
                if (
                    previousFocus &&
                    previousFocus.isConnected
                ) {
                    previousFocus.focus();
                }

            }


            // Close when Escape is pressed.
            function handleEscape(event) {

                if (event.key === "Escape") {
                    closeMemory();
                }

            }


            closeButton.addEventListener(
                "click",
                closeMemory
            );

            details.appendChild(closeButton);


            // Display the expanded photograph.
            if (memory.image_path) {

                const photo =
                    document.createElement("img");

                photo.src = memory.image_path;
                photo.alt =
                    memory.title || "Hawaii memory";

                photo.className = "expanded-photo";

                details.appendChild(photo);

            }


            // Display the memory title.
            const title = document.createElement("h2");

            title.textContent =
                memory.title || "Untitled Memory";

            details.appendChild(title);


            // Display the date.
            if (memory.memory_date) {

                const date = document.createElement("p");

                date.textContent = memory.memory_date;

                details.appendChild(date);

            }


            // Display the location.
            if (memory.location) {

                const location = document.createElement("p");

                location.textContent = memory.location;

                details.appendChild(location);

            }


            // Display the description.
            if (memory.description) {

                const description =
                    document.createElement("p");

                description.textContent = memory.description;

                details.appendChild(description);

            }


            // Add the expanded memory to the overlay.
            overlay.appendChild(details);

            document.body.appendChild(overlay);


            // Close when clicking outside the memory.
            overlay.addEventListener(
                "click",
                event => {

                    if (event.target === overlay) {
                        closeMemory();
                    }

                }
            );


            // Listen for Escape.
            document.addEventListener(
                "keydown",
                handleEscape
            );

            // Move keyboard focus to the close button.
            closeButton.focus();

        }


        // ==========================================
        // INITIALIZE WEBSITE
        // ==========================================

        // Load memories when the page opens.
        loadMemories();

        // Recalculate the arrangement when the screen
        // changes size, but not during an active drag.
        let resizeTimer;

        window.addEventListener("resize", () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {

                if (!activeDrag) {
                    arrangePolaroids();
                }

            }, 200);

        });
