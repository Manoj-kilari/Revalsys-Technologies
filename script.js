   $(document).ready(function() {
        let uploadedFiles = [];
        let currentView = 'dashboard'; // Track current view
        
        // Toggle Sidebar for mobile
        $('#menuToggle').on('click', function() {
            $('#sidebar').toggleClass('active');
        });
        
        // Close sidebar when clicking outside on mobile
        $(document).on('click', function(e) {
            if ($(window).width() <= 991) {
                if (!$(e.target).closest('#sidebar, #menuToggle').length) {
                    $('#sidebar').removeClass('active');
                }
            }
        });
        
        // Navigation: My Tickets
        $('#myTicketsNav').on('click', function(e) {
            e.preventDefault();
            showMyTickets();
            updateNavActive($(this));
        });
        
        // Navigation: Dashboard
        $('#dashboardNav').on('click', function(e) {
            e.preventDefault();
            showAllTickets();
            updateNavActive($(this));
        });
        
        // Navigation: Masters
        $('#mastersNav').on('click', function(e) {
            e.preventDefault();
            updateNavActive($(this));
            alert('Masters page - Feature coming soon!');
        });
        
        // Navigation: Reports
        $('#reportsNav').on('click', function(e) {
            e.preventDefault();
            updateNavActive($(this));
            alert('Reports page - Feature coming soon!');
        });
        
        // Update active navigation state
        function updateNavActive(element) {
            $('.sidebar-menu a').removeClass('active');
            element.addClass('active');
        }
        
        // Show My Tickets view
        function showMyTickets() {
            currentView = 'mytickets';
            $('#addTicketSection').hide();
            $('#tableSection').fadeIn();
            $('#filterSection').fadeIn();
            $('#pageTitle').html('<i class="bi bi-ticket-perforated"></i> My Tickets');
            
            // Filter to show only user's tickets
            filterMyTickets();
        }
        
        // Show All Tickets view (Dashboard)
        function showAllTickets() {
            currentView = 'dashboard';
            $('#addTicketSection').hide();
            $('#tableSection').fadeIn();
            $('#filterSection').fadeIn();
            $('#pageTitle').html('<i class="bi bi-grid-fill"></i> Ticket List');
            
            // Show all tickets
            $('#ticketTableBody tr').show();
        }
        
        // Filter tickets to show only user's tickets
        function filterMyTickets() {
            $('#ticketTableBody tr').each(function() {
                if ($(this).attr('data-user-ticket') === 'true') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
        
        // Raise Ticket Button
        $('#raiseTicketBtn, .btn-raise').on('click', function() {
            $('#tableSection').hide();
            $('#filterSection').hide();
            $('#addTicketSection').fadeIn();
            $('#pageTitle').html('<i class="bi bi-plus-circle"></i> Add Ticket');
        });
        
        // Back Button and Cancel Button
        $('#backBtn, #cancelBtn').on('click', function() {
            $('#addTicketSection').hide();
            $('#filterSection').fadeIn();
            
            // Return to previous view
            if (currentView === 'mytickets') {
                showMyTickets();
            } else {
                showAllTickets();
            }
        });
        
        // Editor Toolbar Buttons
        $('.editor-btn').on('click', function() {
            $(this).toggleClass('active');
        });
        
        // File Upload - Drag and Drop
        const uploadBox = $('#uploadBox');
        const fileInput = $('#fileInput');
        const fileList = $('#fileList');
        
        uploadBox.on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('dragover');
        });
        
        uploadBox.on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('dragover');
        });
        
        uploadBox.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('dragover');
            
            const files = e.originalEvent.dataTransfer.files;
            handleFiles(files);
        });
        
        uploadBox.on('click', function() {
            fileInput.click();
        });
        
        fileInput.on('change', function() {
            const files = this.files;
            handleFiles(files);
        });
        
        function handleFiles(files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                uploadedFiles.push(file);
                displayFile(file);
            }
        }
        
        function displayFile(file) {
            const fileItem = $('<div class="file-item"></div>');
            const fileInfo = $(`
                <div class="file-info">
                    <i class="bi bi-file-earmark file-icon"></i>
                    <span class="file-name">${file.name}</span>
                </div>
            `);
            const removeBtn = $('<button type="button" class="file-remove"><i class="bi bi-x-circle"></i></button>');
            
            removeBtn.on('click', function() {
                const index = uploadedFiles.indexOf(file);
                if (index > -1) {
                    uploadedFiles.splice(index, 1);
                }
                fileItem.remove();
            });
            
            fileItem.append(fileInfo);
            fileItem.append(removeBtn);
            fileList.append(fileItem);
        }
        
        // Form Submit
        $('#addTicketForm').on('submit', function(e) {
            e.preventDefault();
            
            if (this.checkValidity()) {
                alert('Ticket created successfully!');
                
                // Reset form
                this.reset();
                uploadedFiles = [];
                fileList.empty();
                
                // Return to previous view
                $('#addTicketSection').hide();
                $('#filterSection').fadeIn();
                
                if (currentView === 'mytickets') {
                    showMyTickets();
                } else {
                    showAllTickets();
                }
            } else {
                alert('Please fill in all required fields.');
            }
        });
        
        // Save & Send Button
        $('.btn-save-send').on('click', function() {
            if ($('#addTicketForm')[0].checkValidity()) {
                alert('Ticket saved and sent successfully!');
                
                // Reset form
                $('#addTicketForm')[0].reset();
                uploadedFiles = [];
                fileList.empty();
                
                // Return to previous view
                $('#addTicketSection').hide();
                $('#filterSection').fadeIn();
                
                if (currentView === 'mytickets') {
                    showMyTickets();
                } else {
                    showAllTickets();
                }
            } else {
                alert('Please fill in all required fields.');
            }
        });
        
        // Select all checkboxes
        $('#selectAll').on('change', function() {
            $('.row-checkbox:visible').prop('checked', this.checked);
        });
        
        // Update select all when individual checkboxes change
        $('.row-checkbox').on('change', function() {
            const totalVisible = $('.row-checkbox:visible').length;
            const checkedVisible = $('.row-checkbox:visible:checked').length;
            $('#selectAll').prop('checked', totalVisible === checkedVisible && totalVisible > 0);
        });
        
        // Row click handler
        $('#ticketTableBody').on('click', 'tr', function(e) {
            if (!$(e.target).is('input, button, i')) {
                $(this).find('.row-checkbox').prop('checked', function(i, val) {
                    return !val;
                }).trigger('change');
            }
        });
        
        // Action menu handler
        $(document).on('click', '.action-menu', function(e) {
            e.stopPropagation();
            alert('Action menu clicked. Implement dropdown menu here.');
        });
        
        // Search button handler
        $('#searchBtn').on('click', function() {
            const ticketId = $('#filterTicketId').val();
            const department = $('#filterDepartment').val();
            const subDepartment = $('#filterSubDepartment').val();
            const issueType = $('#filterIssueType').val();
            
            console.log('Search criteria:', {
                ticketId, department, subDepartment, issueType
            });
            
            alert('Search functionality would filter the table based on selected criteria');
        });
        
        // Items per page change handler
        $('#itemsPerPage').on('change', function() {
            console.log('Items per page changed to:', $(this).val());
            alert('Would reload table with ' + $(this).val() + ' items per page');
        });
        
        // Reassign button handler
        $('.btn-reassign').on('click', function() {
            const checkedCount = $('.row-checkbox:checked').length;
            if (checkedCount > 0) {
                alert(`Reassigning ${checkedCount} ticket(s)`);
            } else {
                alert('Please select at least one ticket to reassign');
            }
        });
        
        // Escalate button handler
        $('.btn-escalate').on('click', function() {
            const checkedCount = $('.row-checkbox:checked').length;
            if (checkedCount > 0) {
                alert(`Escalating ${checkedCount} ticket(s)`);
            } else {
                alert('Please select at least one ticket to escalate');
            }
        });
        
        // Extract button handler
        $('.btn-extract').on('click', function() {
            alert('Extracting ticket data to Excel/CSV format');
        });
    });
