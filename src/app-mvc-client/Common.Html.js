class Html {

    attachAntiForgeryToken(obj) {
        var token = $('[name="__RequestVerificationToken"]').val();

        if (!token) {
            throw new Error("__RequestVerificationToken element not found.");
        }

        obj.__RequestVerificationToken = token;

        return obj;
    }

    jtableCreatedByFullNameColumn() {
        return {
            title: ui.getResource('CreatedByFullName'),
            width: '10%',
            visibility: 'hidden',
            sorting: true,
            create: false,
            edit: false
        };
    };

    jtableModifiedByFullNameColumn() {
        return {
            title: ui.getResource('ModifiedByFullName'),
            width: '10%',
            visibility: 'hidden',
            sorting: true,
            create: false,
            edit: false
        };
    };

    jtableCreatedOnColumn() {
        return {
            title: ui.getResource('CreatedOnColumn'),
            width: '10%',
            sorting: true,
            create: false,
            edit: false,
            display: function (data) {
                if (data.record.CreatedOn) {
                    var createdOn = new Date(data.record.CreatedOn);
                    return createdOn.getDate() + "-" + (createdOn.getMonth() + 1) + "-" + createdOn.getFullYear();
                }
                return "";
            }
        };
    };


    jtableDateColumn(options) {
        return {
            title: ui.getResource(options.title),
            width: '10%',
            sorting: true,
            create: false,
            edit: false,
            display: function (data) {
                if (data.record[options.name]) {
                    var date = new Date(data.record[options.name]);
                    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                }
                return "";
            }
        };
    };

    jtableModifiedOnColumn() {
        return {
            title: ui.getResource('ModifiedOnColumn'),
            width: '10%',
            sorting: true,
            create: false,
            edit: false,
            display: function (data) {
                if (data.record.ModifiedOn) {
                    var modifiedOn = new Date(data.record.ModifiedOn);
                    return modifiedOn.getDate() + "-" + (modifiedOn.getMonth() + 1) + "-" + modifiedOn.getFullYear();

                }

                return "";
            }
        };
    };

    jtableEditColumn(options) {
        return {
            title: ui.getResource(''),
            visibility: 'fixed',
            width: '0.2%',
            sorting: false,
            create: false,
            edit: false,
            listClass: 'jtable-command-column',
            display: function (data) {
                var html = '';
                if (typeof (options) === 'string') {
                    html = '<button title="Edit Record" onclick="document.location=\'' +
                        options + '/' + data.record.Id +
                        '\'" class="jtable-command-button jtable-edit-command-button"><span>Edit Record</span></button>';
                } else {
                    html = $(
                        '<button title="Edit Record" class="jtable-command-button jtable-edit-command-button"><span>Edit Record</span></button>');
                    html.data('record', data.record);
                    html.on('click',
                        function () {
                            options.click($(this).data('record'));
                        });
                }

                return html;
            }
        };
    };
};

var html = new Html();