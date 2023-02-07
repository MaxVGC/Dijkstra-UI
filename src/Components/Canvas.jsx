import React, { useState, useEffect } from 'react'
import { Stage, Layer, Circle, Line, Label, Group, Tag, Text } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';

export default function Canvas({ eleContainer }) {
    const [stageSize, setstageSize] = useState({
        width: 1,
        height: 1
    });
    const [stage, setStage] = useState({
        scale: 1,
        y: 0,
        x: 0
    });
    const [union, setUnion] = useState({
        nodes: [],
        value: null
    });
    const [edit, setEdit] = useState({
        conexion: null
    });

    const dataStore = useSelector(store => store.data);
    const dispatch = useDispatch();
    const handleWheel = (e) => {
        e.evt.preventDefault();
        const scaleBy = 1.02;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };
        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        setStage({
            scale: newScale,
            x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
            y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale
        });
    };

    const addNode = (e) => {
        if (e.target.nodeType === "Stage") {
            const stagex = e.target.getStage();
            const pointerPosition = stagex.getRelativePointerPosition();
            const x = pointerPosition.x;
            const y = pointerPosition.y;
            const node = {
                x: x,
                y: y,
                id: getNextLetter(),
                radius: 20,
                fill: "#153966",
                stroke: "#18a1ba"
            }
            dispatch({ type: 'ADD_NODE', payload: node });
        }
    }

    useEffect(() => {
        setstageSize({
            width: eleContainer.current.offsetWidth,
            height: eleContainer.current.offsetHeight
        })
        setStage(({
            scale: 1,
            y: eleContainer.current.offsetHeight / 2,
            x: eleContainer.current.offsetWidth / 2
        }))
    }, [])

    window.addEventListener('resize', function (event) {
        setstageSize({
            width: eleContainer.current.offsetWidth,
            height: eleContainer.current.offsetHeight
        })
    }, true);

    function getNextLetter() {
        const array = dataStore.nodes.map(node => node.id);
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < alphabet.length; i++) {
            if (!array.includes(alphabet[i])) {
                return alphabet[i];
            }
        }
    }

    function addConexion(node) {
        if (union.nodes.length == 0) {
            setUnion({
                nodes: [node],
                value: null
            })
        } else {
            if (union.nodes.length == 1 && union.nodes[0].id !== node.id) {
                dispatch({ type: 'ADD_CONEXION', payload: { nodes: [union.nodes[0], node], value: Math.floor(Math.random() * 100) + 1 } });
                setUnion({
                    nodes: [],
                    value: null
                })
            }
        }
    }

    function showEditConexion(conex) {
        if (conex == null) {
            setEdit({
                conexion: null
            })
        } else {
            setEdit({
                conexion: conex
            })
        }
    }

    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const value = event.target.value;
            if (value != null && value != "" && value > 0) {
                dispatch({ type: 'UPDATE_CONEXION', payload: {conexion:edit.conexion,value:value} });
                setEdit({
                    conexion: null
                })
            }
        }
      };

    return (
        <div id='canvas'>
            {
                edit.conexion != null && (
                    <div id="editConexion">
                        <div className="edit">
                            <div className="input">
                                <span>Valor:</span>
                                <input type="number" min="1" autoFocus={true} onKeyDown={handleKeyDown} onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault()}}}/>
                            </div>
                        </div>
                    </div>
                )
            }
            <Stage width={stageSize.width} onWheel={handleWheel} height={stageSize.height} draggable={true} scaleX={stage.scale} scaleY={stage.scale} x={stage.x} y={stage.y} onClick={(e) => (e.evt.button == 0 && addNode(e))}>
                {dataStore.conexions.length !== 0 &&
                    <Layer>
                        {dataStore.conexions.map((conex, index) => {
                            return (
                                <Group key={index} onClick={(e) => { showEditConexion(conex) }}>
                                    <Line
                                        points={[conex.nodes[0].x, conex.nodes[0].y, conex.nodes[1].x, conex.nodes[1].y]}
                                        stroke={conex.stroke == null ? ("#ffffff26") : (conex.stroke)}
                                        strokeWidth={4}
                                        lineCap={"round"}
                                        lineJoin={"round"}
                                    />
                                    <Label x={(conex.nodes[0].x + conex.nodes[1].x) / 2} y={(conex.nodes[0].y + conex.nodes[1].y) / 2}>
                                        <Text text={conex.value} fill={"#ffffff"} />
                                    </Label>
                                </Group>
                            )
                        })}
                    </Layer>
                }
                {dataStore.nodes.length !== 0 &&
                    <Layer>
                        {dataStore.nodes.map((node, index) => {
                            return (
                                <Group key={index} onClick={(e) => (e.evt.button == 2 ? (addConexion(node)) : (e.evt.button == 1 && dispatch({ type: 'ERASE_NODE', payload: node.id })))}>
                                    <Circle key={index} x={node.x} y={node.y} radius={node.radius} fill={dataStore.from?.id == node.id ? ("#3d6615") : (dataStore.to?.id == node.id ? ("#661522") : (node.fill))} stroke={dataStore.from?.id == node.id ? ("#25ba18") : (dataStore.to?.id == node.id ? ("#ba182d") : ("#188bba"))} />
                                    <Label x={node.x} y={node.y}>
                                        <Text text={node.id} fill={"#ffffff"} />
                                    </Label>
                                </Group>
                            )
                        })}
                    </Layer>
                }
            </Stage>
        </div>
    )
}

