/// <reference path="../../../common/js/Cube.js" />

var MyScheduleViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "MyScheduleViewModel");
    this.init();
}
MyScheduleViewModel.prototype = new cb.model.ContainerModel();
MyScheduleViewModel.prototype.constructor = MyScheduleViewModel;

MyScheduleViewModel.prototype.init = function () {

    var fields = {
        addSchedule: new cb.model.SimpleModel,
        


    };
    this.setData(fields);
    this.setDirty(false);

}