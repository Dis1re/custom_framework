function Graph({id='canvas', WIN, width = 500, height = 500, callbacks}) {
    let canvas;
    if (id) {
        canvas = document.getElementById(id);
    } else {
        canvas = document.createElement('canvas');
        document.querySelector('body').appendChild(canvas);
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    if (callbacks){
        canvas.addEventListener('wheel', callbacks.wheel);
        canvas.addEventListener('mousemove', callbacks.mousemove);
        canvas.addEventListener('mousedown', callbacks.mousedown);
        canvas.addEventListener('mouseup', callbacks.mouseup);
        canvas.addEventListener('mouseout', callbacks.mouseout);
    }

    const xs = (x) => {
        return (canvas.width * (x - WIN.LEFT) / WIN.WIDTH);
    }

    const ys = (y) => {
        return (canvas.height - (canvas.height * (y - WIN.BOTTOM) / WIN.HEIGHT));
    }

    this.sx = function (x) {
        return x * WIN.WIDTH/ canvas.width;
    }

    this.sy = function (y) {
        return -y * WIN.HEIGHT / canvas.height;
    }

    this.clear = function () {
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0, canvas.width, canvas.height);
    }

    this.line = function (x1, y1,
                          x2, y2,
                          color='black',
                          width=0.5,
                          isDash=false) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if (isDash) {
            ctx.setLineDash([10, 10]);
        }
        else{
            ctx.setLineDash([0,0]);
        }
        ctx.moveTo(xs(x1), ys(y1));
        ctx.lineTo(xs(x2), ys(y2));
        ctx.closePath();
        ctx.stroke();
    }

    this.text = function (text, x, y, color='black', size='12', font='Arial') {
        ctx.beginPath();
        ctx.font = size+"px " + font;
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fillText(text, xs(x), ys(y));
    }


    this.point = function (x, y, color = 'black', size=1) {
        ctx.beginPath();
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.arc(xs(x), ys(y), size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }

    this.polygon = function (points, color='cyan') {

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 0.1;
        if (points.length > 2) {
            ctx.moveTo(xs(points[0].x), ys(points[0].y));

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(xs(points[i].x), ys(points[i].y));
            }
            ctx.lineTo(xs(points[0].x), ys(points[0].y));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

}