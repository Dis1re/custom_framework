Surfaces.prototype.sphere =
    (
        point = new Point(0, 0, 0),
        radius = 5,
        color = '#888888',
        segments = 10
    ) => {
        const center = new Point(point.x, point.y+radius, point.z)
        const points = [];
        const edges = [];
        const polygons = [];

        for (let i = 0; i <= segments; i++) {
            const phi = (i / segments) * Math.PI;
            const y = center.y + radius * Math.cos(phi);

            for (let j = 0; j <= segments; j++) {
                const theta = (j / segments) * (2 * Math.PI);
                const x = center.x + radius * Math.sin(phi) * Math.cos(theta);
                const z = center.z + radius * Math.sin(phi) * Math.sin(theta);
                points.push(new Point(x, y, z));
            }
        }

        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const p1 = i * (segments + 1) + j;
                const p2 = p1 + 1;
                const p3 = (i + 1) * (segments + 1) + j;
                const p4 = p3 + 1;

                edges.push(new Edge(p1, p2));
                edges.push(new Edge(p2, p4));
                edges.push(new Edge(p4, p3));
                edges.push(new Edge(p3, p1));
                polygons.push(new Polygon([p1, p2, p4, p3], color));
            }
        }

        return new Surface(points, edges, polygons);
    }