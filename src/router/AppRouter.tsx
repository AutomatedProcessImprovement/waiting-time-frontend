import {Routes, Route} from "react-router-dom";
import Upload from "../components/Upload";
import paths from "./paths";
import Dashboard from "../components/dashboard/Dashboard";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Upload/>} />
            <Route path={paths.UPLOAD_PATH} element={<Upload/>} />
            <Route path={paths.DASHBOARD_PATH} element={<Dashboard/>} />
        </Routes>
    )
}
export default AppRouter;