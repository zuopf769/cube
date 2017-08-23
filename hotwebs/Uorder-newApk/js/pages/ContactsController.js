UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ContactsController = function () {
    this.contactFunc = Template7.compile($$("#contactItemTpl").html());
};
UOrderApp.pages.ContactsController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.ContactsController.prototype.pageInit = function (page) {
    var self = this;
    cb.rest.getJSON('ma/Agents/getAgentContacts', function (data) {
        if (data.code != 200) {
            myApp.toast('获取联系人列表失败', 'error').show(true);
            return;
        }
        var resultContent = self.contactFunc(self.dataFormat(data.data));
        $$('.page[data-page="contactsListPage"] .contactsListPage-container').html(resultContent);

        $$('div[data-page="contactsListPage"] .contactsPage-item .contacts-item-area').on('click', function () {
            var id = $$(this).parent().attr('data-id');
            myApp.mainView.router.loadPage({
                url: 'pages/contactsNew.html',
                query: { id: id }
            });
        });
    });    

    $$(document).on('pageBack', '.page[data-page="addContactPage"]', function (e) {
        cb.rest.getJSON('ma/Agents/getAgentContacts', function (data) {
            if (data.code != 200) {
                myApp.toast('获取联系人列表失败', 'error').show(true);
                return;
            }
            var resultContent = self.contactFunc(self.dataFormat(data.data));
            $$('.page[data-page="contactsListPage"] .contactsListPage-container').html(resultContent);

            $$('div[data-page="contactsListPage"] .contactsPage-item').on('click', function () {
                var id = $$(this).attr('data-id');
                myApp.mainView.router.loadPage({
                    url: 'pages/contactsNew.html',
                    query: { id: id }
                });
            });
        });
    });
};

UOrderApp.pages.ContactsController.prototype.dataFormat = function (val) {
    for (var i = 0; i < val.length; i++) {
        val[i].colorId = val[i].id % 8;
        if (val[i].cFullName.length >= 3)
            val[i].cAbbr = val[i].cFullName.substr(val[i].cFullName.length - 2);
        else
            val[i].cAbbr = val[i].cFullName;
    }
    return { contacts: val }
};