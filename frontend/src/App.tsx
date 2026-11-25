import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/content/Home";
import SignIn from "./pages/users/SignIn";
import SignUp from "./pages/users/SignUp";
import Dashboard from "./pages/content/Dashboard";

import CreateTask from "./pages/tasks/CreateTask";
import SearchTask from "./pages/tasks/SearchTask";
import UpdateTask from "./pages/tasks/UpdateTask";

import CreateLabel from "./pages/labels/CreateLabel";
import ListLabels from "./pages/labels/ListLabels";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Página inicial */}
                <Route path="/" element={<Home />} />

                {/* Autenticação */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Dashboard */}
                <Route path="/dashboard/:userId" element={<Dashboard />} />

                {/* Tarefas */}
                <Route path="/tasks/create/:userId" element={<CreateTask />} />
                <Route path="/tasks/search/:userId" element={<SearchTask />} />
                <Route path="/tasks/update/:taskId/:userId" element={<UpdateTask />} />

                {/* Etiquetas */}
                <Route path="/labels/:userId" element={<ListLabels />} />
                <Route path="/labels/create/:userId" element={<CreateLabel />} />

                {/* Rota inválida */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
