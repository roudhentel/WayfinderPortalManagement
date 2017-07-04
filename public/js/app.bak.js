var app = angular.module("app", []);

app.controller("mainCtrl", function ($scope) {
    var s = Snap('#svg');

    s.click(function (e) {
        console.log("clientX: " + e.clientX);
        console.log("clientY: " + e.clientY);
        console.log("screenX: " + e.screenX);
        console.log("screenY: " + e.screenY);
        console.log(e);
    });

    var Location1 = s.circle(100, 100, 10);
    var Location2 = s.circle(200, 100, 10);
    var Location3 = s.circle(300, 100, 10);

    var movingBall = s.circle(100, 300, 10);
    movingBall.attr({
        fill: '#f00',
        stroke: '#000',
        strokeWidth: 1
    });

    var loc1Direction = [
        { movement: "up", value: 200 }
    ];

    var loc2Direction = [
        { movement: "up", value: 100 },
        { movement: "right", value: 100 },
        { movement: "up", value: 100 }
    ];

    var loc3Direction = [
        { movement: "up", value: 100 },
        { movement: "right", value: 200 },
        { movement: "up", value: 100 }
    ];

    var moveBall = function (directions, idx) {
        if (directions.length <= idx) return;

        var x = movingBall.node.cx.baseVal.value;
        var y = movingBall.node.cy.baseVal.value;

        var tx = x;
        var ty = y;

        switch (directions[idx].movement) {
            case "up":
                y = y - directions[idx].value;
                break;
            case "down":
                y = y + directions[idx].value;
                break;
            case "right":
                x = x + directions[idx].value;
                break;
            case "left":
                x = x - directions[idx].value;
                break;
        }

        var obj = {
            cx: x,
            cy: y
        }

        var speed = x !== tx ? Math.abs(tx - x) * 5 : Math.abs(ty - y) * 5;
        movingBall.animate(obj, speed, function () {
            moveBall(directions, ++idx);
        }, function () {
            console.log("1");
        });
    }

    $scope.start = function () {
        movingBall.attr({
            cx: 100,
            cy: 300
        });
        switch ($scope.input) {
            case 1:
                moveBall(loc1Direction, 0);
                break;
            case 2:
                moveBall(loc2Direction, 0);
                break;
            case 3:
                moveBall(loc3Direction, 0);
                break;
        }
    }
});