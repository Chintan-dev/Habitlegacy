document.addEventListener("DOMContentLoaded", () => {
    console.log("🔍 Checking Firebase:", firebase);

    if (!firebase.apps.length) {
        console.error("❌ Firebase is not initialized!");
        return;
    }

    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const dashboard = document.getElementById("dashboard");
    const loginContainer = document.getElementById("login-container");

    const addTaskBtn = document.getElementById("add-task");
    const taskInput = document.getElementById("task-name");
    const taskList = document.getElementById("task-list");

    const userLevel = document.getElementById("user-level");
    const progress = document.getElementById("progress");

    let user = null;
    let xp = 0;
    let level = 1;

    // Google Login
    loginBtn.addEventListener("click", () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                user = result.user;
                showDashboard();
            })
            .catch(error => console.error("❌ Login failed:", error));
    });

    // Logout
    logoutBtn.addEventListener("click", () => {
        auth.signOut().then(() => {
            dashboard.style.display = "none";
            loginContainer.style.display = "block";
        });
    });

    // Show Dashboard
    function showDashboard() {
        loginContainer.style.display = "none";
        dashboard.style.display = "block";
        loadTasks();
    }

    // Add Task
    addTaskBtn.addEventListener("click", () => {
        const taskName = taskInput.value.trim();
        if (taskName && user) {
            db.collection("tasks").add({
                userId: user.uid,
                task: taskName,
                completed: false,
                xp: 10
            }).then(() => {
                taskInput.value = "";
                loadTasks();
                updateXP(10);
            });
        }
    });

    // Load Tasks
    function loadTasks() {
        taskList.innerHTML = "";
        if (user) {
            db.collection("tasks")
                .where("userId", "==", user.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        const task = doc.data();
                        const li = document.createElement("li");
                        li.textContent = task.task;
                        li.addEventListener("click", () => completeTask(doc.id, task.xp));
                        taskList.appendChild(li);
                    });
                });
        }
    }

    // Complete Task & Gain XP
    function completeTask(taskId, taskXP) {
        db.collection("tasks").doc(taskId).update({ completed: true })
            .then(() => {
                updateXP(taskXP);
                loadTasks();
            });
    }

    // Update XP & Level System
    function updateXP(amount) {
        xp += amount;
        if (xp >= level * 50) {
            xp = 0;
            level++;
        }
        userLevel.textContent = `Level: ${level}`;
        progress.textContent = `XP: ${xp}`;
    }

    // Check Authentication
    auth.onAuthStateChanged(currentUser => {
        if (currentUser) {
            user = currentUser;
            showDashboard();
        }
    });
});
