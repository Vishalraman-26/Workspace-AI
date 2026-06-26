export async function getTasks() {
    console.log("Task Service Executed");
    return [
        {
            id: 1,
            title: "Finish Workspace AI",
            completed: false
        },
        {
            id: 2,
            title: "Deploy Backend",
            completed: false
        }
    ];

}

export async function createTask(args){

    return {
        success:true,
        task:args
    };

}

export async function updateTask(){

    return {
        success:true
    };

}

export async function deleteTask(){

    return {
        success:true
    };

}