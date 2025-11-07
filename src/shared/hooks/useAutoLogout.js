import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

/**
 *
 * @param {number} timeoutMinutes
 * @param {number} warningSeconds
 */
export default function useAutoLogout(timeoutMinutes = 5, warningSeconds = 30) {
    const navigate = useNavigate();
    const location = useLocation();
    const idleTimer = useRef(null);
    const warningTimer = useRef(null);

    useEffect(() => {
        if (location.pathname === "/login") return;

        const totalTimeout = timeoutMinutes * 60 * 1000;
        const warningTimeout = totalTimeout - warningSeconds * 1000;

        const handleLogout = async () => {
            await Swal.fire({
                icon: "warning",
                title: "Kamu telah logout",
                text: "Kamu tidak aktif selama 5 menit.",
                confirmButtonText: "OK",
            });
            sessionStorage.clear();
            navigate("/login");
        };

        const showWarning = async () => {
            const result = await Swal.fire({
                icon: "info",
                title: "Tidak ada aktivitas",
                text: `Kamu akan logout otomatis dalam ${warningSeconds} detik.`,
                showCancelButton: true,
                confirmButtonText: "Tetap login",
                cancelButtonText: "Logout sekarang",
                reverseButtons: true,
                timer: warningSeconds * 1000,
                timerProgressBar: true,
            });

            if (result.isConfirmed) {
                resetTimer();
            } else if (result.dismiss === Swal.DismissReason.timer || result.isDismissed) {
                handleLogout();
            }
        };

        const resetTimer = () => {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            if (warningTimer.current) clearTimeout(warningTimer.current);

            warningTimer.current = setTimeout(showWarning, warningTimeout);
            idleTimer.current = setTimeout(handleLogout, totalTimeout);
        };

        const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
        events.forEach((e) => window.addEventListener(e, resetTimer));

        resetTimer();

        return () => {
            events.forEach((e) => window.removeEventListener(e, resetTimer));
            if (idleTimer.current) clearTimeout(idleTimer.current);
            if (warningTimer.current) clearTimeout(warningTimer.current);
        };
    }, [navigate, location.pathname, timeoutMinutes, warningSeconds]);
}
