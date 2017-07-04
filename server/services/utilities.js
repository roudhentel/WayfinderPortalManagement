function Utilities() {
    var utl = {
        arrayToObject: function (array) {
            var first = array[0].join()
            var headers = first.split(',');

            var jsonData = [];
            for (var i = 1, length = array.length; i < length; i++) {

                var myRow = array[i].join();
                var row = myRow.split(',');

                var data = {};
                for (var x = 0; x < row.length; x++) {
                    data[headers[x]] = row[x];
                }
                jsonData.push(data);

            }
            return jsonData;
        },
        objectToArray: function (objArray) {
            var values = [];

            objArray.forEach(function (value, key) {
                var obj = [];
                for (var key in value) {
                    obj.push(value[key]);
                }

                values.push(obj);
            }, this);

            return values;
        },
        dynamicSort: function (property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }
    }

    return utl;
}

module.exports = Utilities();