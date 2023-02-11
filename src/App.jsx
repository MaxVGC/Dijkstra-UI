import React, { useRef, useState } from 'react'
import Canvas from './Components/Canvas'
import { useSelector, useDispatch } from 'react-redux';
import Dijkstra from './algoritmo/Dijkstra';

export default function App() {
    const canvaContainer = useRef();
    const [valueSelects, setvalueSelects] = useState({
        select1: null,
        select2: null
    })
    const dataStore = useSelector(store => store.data);
    const dispatch = useDispatch();
    function setSelects(selected, select) {
        if (select == 1) {
            setvalueSelects({ ...valueSelects, select1: selected.id })
            dispatch({ type: 'SET_FROM', payload: selected });
        } else {
            setvalueSelects({ ...valueSelects, select2: selected.id })
            dispatch({ type: 'SET_TO', payload: selected });
        }
    }

    function getNodesConnected(node) {
        var nodesConnected = [];
        dataStore.conexions.map((element) => {
            if (node.id == element.nodes[0].id) {
                nodesConnected.push({ node: element.nodes[1], value: element.value });
            } else if (node.id == element.nodes[1].id) {
                nodesConnected.push({ node: element.nodes[0], value: element.value });
            }
        })
        return nodesConnected;
    }

    function getAllNodesConnected() {
        var allNodesConnected = [];
        dataStore.nodes.map((element) => {
            allNodesConnected.push({ node: element, nodesConnected: getNodesConnected(element) });
        })
        return allNodesConnected;
    }

    function executeDijkstra() {
        var conexions = dataStore.conexions;
        conexions.map((element) => {
            element.stroke = "#ffffff26";
        })
        dispatch({ type: 'SET_CONEXIONS', payload: conexions });
        var dijkstra = new Dijkstra(getAllNodesConnected(), dataStore.from, dataStore.to).getMostShortPath();
        console.log("dikstra: ", dijkstra)
        dispatch({ type: 'SET_DIJKSTRA', payload: dijkstra });
        executeAnimation(dijkstra);
    }

    function executeAnimation(dijkstra) {
        var path = dijkstra.pathComplete;
        var path2 = dijkstra.pathShort;
        path2.reverse();
        var conexions = dataStore.conexions;
        var i = 0;
        var interval = setInterval(() => {
            if (i < path.length) {
                conexions.map((element) => {
                    if (path[i].from?.id == element.nodes[0].id || path[i].from.id == element.nodes[1].id) {
                        if (element.stroke != "#152f66" || element.stroke == null) {
                            element.stroke = "#661522";
                        }
                    }
                    if (path[i].from.id == element.nodes[0].id && path[i].to.id == element.nodes[1].id || path[i].from.id == element.nodes[1].id && path[i].to.id == element.nodes[0].id) {
                        element.stroke = "#152f66";
                    }
                })
                dispatch({ type: 'SET_CONEXIONS', payload: conexions });
                i++;
            } else {
                clearInterval(interval);
                executeAnimation2(dijkstra);
            }
        }, 2000);
    }

    function executeAnimation2(dijkstra) {
        var path = dijkstra.pathShort;
        path.reverse();
        var conexions = dataStore.conexions;
        var i = 0;
        var interval = setInterval(() => {
            if (i < path.length - 1) {
                conexions.map((element) => {
                    if (element.nodes[0].id == path[i].id && element.nodes[1].id == path[i + 1].id || element.nodes[0].id == path[i + 1].id && element.nodes[1].id == path[i].id) {
                        element.stroke = "#3d6615";
                    }
                })
                dispatch({ type: 'SET_CONEXIONS', payload: conexions });
                i++;
            } else {
                clearInterval(interval);
            }
        }, 2000);
    }

    function getDistanceBetweenNodes(node1, node2) {
        var distance = dataStore.conexions.find((element) => {
            if (element.nodes[0].id == node1.id && element.nodes[1].id == node2.id || element.nodes[0].id == node2.id && element.nodes[1].id == node1.id) {
                return element;
            }
        });

        return distance.value;
    }

    function getDistanceTotalPathShort() {
        var distance = 0;
        var path = dataStore.dijkstra.pathShort;
        for (var i = 0; i < path.length - 1; i++) {
            distance += parseFloat(getDistanceBetweenNodes(path[i], path[i + 1]));
        }
        return distance;
    }

    function getConexionsWithValue(id) {
        var conexions = [];
        dataStore.conexions.map((element) => {
            if (element.nodes[0].id == id || element.nodes[1].id == id) {
                conexions.push(element);
            }
        })
        return conexions;
    }

    return (
        <>
            <div className="row" id='principal'>
                <div className="col-md-3" id='tableGraph'>
                    <div className="row header">
                        <span>Algoritmo de dijkstra</span>
                    </div>
                    <div className="row">
                        <div className="inputNodes">
                            <div className="inputs">
                                <div className="xP">
                                    <span>Desde:</span>
                                    <select name="select" onChange={(e) => { e.target.selectedIndex == 0 ? (setvalueSelects({ ...valueSelects, select1: null })) : (setSelects(dataStore.nodes[e.target.selectedIndex - 1], 1)) }} >
                                        <option defaultValue={null}>...</option>
                                        {dataStore.nodes.map((element, key) => (
                                            <option key={key} value={element} disabled={element.id == valueSelects.select2}>{element.id}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="xP">
                                    <span>Hasta:</span>
                                    <select name="select" onChange={(e) => { e.target.selectedIndex == 0 ? (setvalueSelects({ ...valueSelects, select2: null })) : (setSelects(dataStore.nodes[e.target.selectedIndex - 1], 2)) }} >
                                        <option defaultValue={null}>...</option>
                                        {dataStore.nodes.map((element, key) => (
                                            <option key={key} value={element} disabled={element.id == valueSelects.select1}>{element.id}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="icon" onClick={() => { executeDijkstra() }}>
                                <ion-icon name="search"></ion-icon>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="colors">
                            <div className="color">
                                <div className="color1" style={{ backgroundColor: "#661522" }}></div>
                                <span>Ruta evaluada</span>
                            </div>
                            <div className="color">
                                <div className="color1" style={{ backgroundColor: "#152f66" }}></div>
                                <span>Ruta pivote</span>
                            </div>
                            <div className="color">
                                <div className="color1" style={{ backgroundColor: "#375a14" }}></div>
                                <span>Ruta mas corta</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {dataStore.dijkstra != null && (
                            <div className="totalDistance">
                                <span className='label'>Distancia total</span>
                                <span className='number'>{getDistanceTotalPathShort()}</span>
                            </div>
                        )}
                    </div>
                    <div className="row">
                        <div className="iteraciones">
                            {dataStore?.dijkstra?.pathComplete.map((element, key) => (
                                <div className="iteracion" key={key}>
                                    <span className='label'>Iteracion {key + 1}</span>
                                    <span>Caminos Disponibles</span>
                                    {getConexionsWithValue(element.to.id).map((element2, key) => (
                                        <span className='routes'>Hacia {element.to.id == element2.nodes[0].id ? (element2.nodes[1].id + " = " + element2.value) : (element2.nodes[0].id + " = " + element2.value)}</span>
                                    ))}
                                    <span className='number'>Camino elegido {element.to.id} - {element.from.id}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-9" ref={canvaContainer} id='graph'>

                    <Canvas eleContainer={canvaContainer} />
                </div>
            </div>
        </>
    )
}
