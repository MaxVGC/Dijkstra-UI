import Step from "./Step";

export default class Dijkstra {
    nodes = [];
    path = new Map();
    flagedNodes = [];
    steps = new Map();
    from = null;
    to = null;
    flag = null;

    constructor(nodes, from, to) {
        this.nodes = nodes;
        this.from = nodes.find(element => element.node.id == from.id);
        this.to = nodes.find(element => element.node.id == to.id);
        this.flagedNodes = [];
    }

    getMinStep() {
        var min = Number.MAX_VALUE;
        var keyA = null;
        for (const [key, value] of this.steps.entries()) {
            if (value.distance < min) {
                min = value.distance;
                keyA = key;
            }
        }
        console.log("getMinStep",keyA)
        return keyA;
    }

    clearDataConexions(map) {
        var aux = []
        for (const [key, value] of map.entries()) {
            aux.push({ from: key, to: value.node })
        }
        return aux;
    }

    getNodesAdyacentes(node) {
        var nodesAdyacentes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].node.id == node.id) {
                nodesAdyacentes = this.nodes[i].nodesConnected;
            }
        }
        return nodesAdyacentes;
    }

    clearPath(map) {
        var aux = []
        for (const [key, value] of map.entries()) {
            aux.push(value)
        }
        return aux
    }

    getNode(id) {
        return this.nodes.find(element => element.node.id == id);
    }

    eraseIterations(conexion) {
        this.path = new Map();
        var i = 0;
        return this.recursiveEraseIterations(conexion, this.to.node, i);
    }

    recursiveEraseIterations(conexion, currentNode, i) {
        console.log("currentNode",currentNode)
        this.path.set(i, currentNode);
        i++;
        if (currentNode == this.from.node) {
            return this.path;
        } else {
            return this.recursiveEraseIterations(conexion, conexion.get(currentNode).node, i);
        }
    }

    getMostShortPath() {
        this.flagedNodes = []
        this.flag = this.from.node;
        this.flagedNodes.push(this.flag);
        var conexion = new Map();
        var flagA = true;
        var distance = 0;
        var cont = 0;
        while (flagA) {
            console.log("currentFlag",this.flag)
            var nodesAdy = this.getNodesAdyacentes(this.flag);
            console.log("nodesAdy",nodesAdy)
            for (var i = 0; i < nodesAdy.length; i++) {
                console.log("flagedNodes",this.flagedNodes)
                if (!this.flagedNodes.includes(nodesAdy[i].node)) {
                    if (this.steps.get(nodesAdy[i].node) == null || (distance + nodesAdy[i].value) < this.steps.get(nodesAdy[i].node).distance) {
                        this.steps.set(nodesAdy[i].node, new Step(distance + nodesAdy[i].value, this.flag));
                    }
                }
            }
            this.flag = this.getMinStep();
            distance = this.steps.get(this.flag).distance;
            this.flagedNodes.push(this.flag);
            conexion.set(this.flag, this.steps.get(this.flag));
            this.steps.delete(this.flag);
            cont++;
            if (this.flag == this.to.node || cont == 100) {
                flagA = false;
            }
        }
        console.log("finaliza")
        this.path = this.eraseIterations(conexion);
        console.log("conexion",conexion)
        console.log("path",this.path)
        return {
            pathComplete: this.clearDataConexions(conexion),
            pathShort: this.clearPath(this.path),
        };
    }
}

