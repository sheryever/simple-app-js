class UserInterface {
    
    resources = [];

    constructor(){
        this.resources = __resources !== undefined ? __resources : [];
    }

    init() {
        if ($.datepicker) {
            $('.rlt-datepicker').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                calendarWeeks: true,
                autoclose: true,
                language: "ar",
                rtl: true
            });
            $('.date-picker').datepicker({ language: 'ar', format: "dd/mm/yyyy", dateFormat: "dd/mm/yy" });
        }

        $('input[type="checkbox"],input[type="radio"] ').parent('label').addClass('pointer');

        $(document).on('keypress',
            'input.integer-only',
            function(e) {
                var keyCode = e.which ? e.which : e.keyCode;

                if (!(keyCode >= 48 && keyCode <= 57)) {
                    return false;
                } 
            });

        $(document).on('keypress',
            'input.float-only',
            function (e) {
                var keyCode = e.which ? e.which : e.keyCode;

                
                if ((keyCode >= 48 && keyCode <= 57)) {
                    // do nothing
                }
                else if (keyCode === 46) {
                    if (this.value.indexOf('.') > -1) return false;
                } else {
                    return false;
                }
            });
    };

    getResource(key) {

        return !this.resources[key] ? key : this.resources[key];
    };

    fixJtableDialogUi() {
        //$(".ui-dialog").bind("dialogopen", function () {
        $(document).on("dialogopen",
            ".ui-dialog",
            function () {
                // Reposition dialog, 'this' refers to the element the even occurred on.
                var $dialog = $(this);

                var $actionButton = $dialog.find("#EditDialogSaveButton");

                if ($actionButton.length > 0) {
                    $actionButton
                        .addClass('btn btn-primary')
                        .prev()
                        .addClass('btn btn-warning cancel');
                }

                $actionButton = $dialog.find("#AddRecordDialogSaveButton");

                if ($actionButton.length > 0) {
                    $actionButton
                        .addClass('btn btn-primary')
                        .prev()
                        .addClass('btn btn-warning cancel');
                }

                $actionButton = $dialog.find("#DeleteDialogButton");

                if ($actionButton.length > 0) {
                    $actionButton
                        .addClass('btn btn-danger')
                        .prev()
                        .addClass('btn btn-warning cancel');
                }
                //$dialog.find('.ui-dialog-titlebar-close').text('x');
            });
    };
};

ui = new UserInterface();