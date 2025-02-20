document.addEventListener("DOMContentLoaded", () => {
    console.log("🔍 Checking Firebase:", firebase);

    // Ensure Firebase is initialized
    if (!firebase.apps.length) {
        console.error("❌ Firebase is not initialized!");
        return;
    }

    // Firebase Auth & Firestore references
    const auth = firebase.auth();
    const db = firebase.firestore();

    // UI Elements
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
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then(result => {
                    user = result.user;
                    showDashboard();
                })
                .catch(error => console.error("❌ Login failed:", error));
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            auth.signOut().then(() => {
                dashboard.style.display = "none";
                loginContainer.style.display = "block";
            });
        });
    }

    // Show Dashboard
    function showDashboard() {
        loginContainer.style.display = "none";
        dashboard.style.display = "block";
        loadTasks();
    }

    // Add Task
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", async () => {
            const taskName = taskInput.value.trim();
            if (taskName && user) {
                try {
                    await db.collection("tasks").add({
                        userId: user.uid,
                        task: taskName,
                        completed: false,
                        xp: 10,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    taskInput.value = "";
                    loadTasks();
                    updateXP(10);
                } catch (error) {
                    console.error("❌ Error adding task:", error);
                }
            } else {
                console.warn("⚠️ Task name is empty or user is not logged in.");
            }
        });
    }

    // Load Tasks
    async function loadTasks() {
        taskList.innerHTML = "";
        if (user) {
            try {
                const snapshot = await db.collection("tasks")
                    .where("userId", "==", user.uid)
                    .orderBy("createdAt", "desc")
                    .get();

                snapshot.forEach(doc => {
                    const task = doc.data();
                    const li = document.createElement("li");
                    li.textContent = task.task;
                    if (task.completed) {
                        li.style.textDecoration = "line-through";
                    }
                    li.addEventListener("click", () => completeTask(doc.id, task.xp));
                    taskList.appendChild(li);
                });
            } catch (error) {
                console.error("❌ Error loading tasks:", error);
            }
        }
    }

    // Complete Task & Gain XP
    async function completeTask(taskId, taskXP) {
        try {
            await db.collection("tasks").doc(taskId).update({ completed: true });
            updateXP(taskXP);
            loadTasks();
        } catch (error) {
            console.error("❌ Error completing task:", error);
        }
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

    // Check Authentication State
    auth.onAuthStateChanged(currentUser => {
        if (currentUser) {
            user = currentUser;
            showDashboard();
        } else {
            dashboard.style.display = "none";
            loginContainer.style.display = "block";
        }
    });
});
