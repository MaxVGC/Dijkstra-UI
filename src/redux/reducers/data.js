const initialState = {
    nodes: [],
    conexions: [],
    from: null,
    to: null,
    dijkstra: null,
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_DIJKSTRA":
            return { ...state, dijkstra: action.payload };
        case "SET_NODES":
            return { ...state, nodes: action.payload };
        case "SET_CONEXIONS":
            return { ...state, conexions: action.payload };
        case "SET_FROM":
            return { ...state, from: action.payload };
        case "SET_TO":
            return { ...state, to: action.payload };
        case "UPDATE_CONEXION":
            return { ...state, conexions: state.conexions.map(conexion => conexion === action.payload.conexion ? {...action.payload.conexion,value:action.payload.value}: conexion) };
        case "UPDATE_NODE":
            const aux = state.conexions.find(conexion => conexion.nodes[0].id === action.payload.id || conexion.nodes[1].id === action.payload.id);
            console.log(aux);
            return { ...state, nodes: state.nodes.map(node => node.id === action.payload.id ? action.payload : node) };
        case "ADD_CONEXION":
            if (state.conexions.find(conexion => conexion.nodes[0].id === action.payload.nodes[0].id && conexion.nodes[1].id === action.payload.nodes[1].id)
                || state.conexions.find(conexion => conexion.nodes[0].id === action.payload.nodes[1].id && conexion.nodes[1].id === action.payload.nodes[0].id)) {
                return state;
            }
            return { ...state, conexions: [...state.conexions, action.payload] };
        case "ERASE_NODE":
            const aux2 = state.conexions.filter(conexion => conexion.nodes[0].id !== action.payload && conexion.nodes[1].id !== action.payload);
            return { ...state, conexions: aux2, nodes: state.nodes.filter(node => node.id !== action.payload) };
        case "ADD_NODE":
            return { ...state, nodes: [...state.nodes, action.payload] };
        default:
            return state
    }
}

export default userReducer;
