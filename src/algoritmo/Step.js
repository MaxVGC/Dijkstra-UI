class Step{
    distance;
    node;
    
    constructor(distance, node){
        this.distance = distance;
        this.node = node;
    }
    
    compareTo(step){
        if(this.distance < step.distance){
            return -1;
        }else if(this.distance > step.distance){
            return 1;
        }else{
            return 0;
        }
    }
}

export default Step;