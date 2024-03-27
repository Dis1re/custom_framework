Surfaces.prototype.cube =
    (
        point = new Point(0, 0, 0),
        size = 10,
        color = '#888888'
    ) => {
        const x = point.x;
        const y = point.y;
        const z = point.z;
        size = size /2;
        const points = [
            new Point(x-size, y+-size, z+size), //0
            new Point(x+size, y+-size, z+size), //1
            new Point(x-size, y+size, z+size), //2
            new Point(x+size, y+size, z+size), //3
            new Point(x-size, y+-size, z+-size), //4
            new Point(x+size, y+-size, z+-size), //5
            new Point(x-size, y+size, z+-size), //6
            new Point(x+size, y+size, z+-size) //7
        ];
        //       2------3
        //      /|     /|
        //     6------7 |
        //     | 0----|-1
        //     |/     |/
        //     4------5
        const edges = [
            new Edge(0, 1),
            new Edge(0, 2),
            new Edge(0, 4),
            new Edge(3, 1),
            new Edge(3, 2),
            new Edge(3, 7),
            new Edge(6, 2),
            new Edge(6, 4),
            new Edge(6, 7),
            new Edge(5, 4),
            new Edge(5, 1),
            new Edge(5, 7)
        ];

        const polygons = [
            new Polygon([0, 1, 3, 2], '#88ff88'),
            new Polygon([0, 1, 5, 4], '#ff8888'),
            new Polygon([0, 4, 6, 2], '#8888ff'),
            new Polygon([7, 5, 1, 3], '#66ff22'),
            new Polygon([7, 3, 2, 6], '#88ffff'),
            new Polygon([7, 6, 4, 5], '#ffff88')
        ];

        return new Surface(
            points,
            edges,
            polygons
        );

    }