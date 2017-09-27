/**
 * Created by Urthur on 2017/7/18.
 */
Demo.CustomDateTime = BI.inherit(BI.Widget, {
    props: {},
    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.date_time_combo",
                    listeners: [{
                        eventName: BI.DateTimeCombo.EVENT_CONFIRM,
                        action: function () {
                            var value = this.getValue();
                            var date = new Date(value.year, value.month, value.day, value.hour, value.minute, value.second);
                            var dateStr = date.print("%Y-%X-%d %H:%M:%S");
                            BI.Msg.alert("日期", dateStr);
                        }
                    }, {
                        eventName: BI.DateTimeCombo.EVENT_CANCEL,
                        action: function () {
                        }
                    }]
                },
                top: 200,
                left: 200
            }]
        };
    }
});
BI.shortcut("demo.date_time", Demo.CustomDateTime);