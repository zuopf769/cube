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
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取联系人列表失败', 'error').show(true);
            return;
        }
        var resultContent = self.contactFunc({ contacts: data.data });
        $$('.page[data-page="contactsListPage"] .contactsListPage-container').html(resultContent);

        $$('div[data-page="contactsListPage"] .contactsPage-item').on('click', function () {
            var id = $$(this).attr('data-id');
            myApp.mainView.router.loadPage({
                url: 'pages/contactsNew.html',
                query: { id: id }
            });
        });
    });    

    $$(document).on('pageBack', '.page[data-page="addContactPage"]', function (e) {
        cb.rest.getJSON('ma/Agents/getAgentContacts', function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('获取联系人列表失败', 'error').show(true);
                return;
            }
            var resultContent = self.contactFunc({ contacts: data.data });
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