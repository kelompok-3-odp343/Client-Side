import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

export const usePageLoader = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  /**
   * Navigasi instan dengan overlay loading singkat.
   * Tidak ada delay buatan sebelum pindah halaman.
   */
  const navigateWithLoad = (path, options = undefined) => {
    // 1. Munculkan Loading Overlay
    setIsLoading(true);

    // 2. Beri jeda sangat singkat (10ms) hanya agar React sempat me-render Overlay
    setTimeout(() => {
      // 3. Lakukan navigasi (Pindah URL)
      navigate(path, options);

      // 4. Matikan loading setelah durasi transisi (misal 500ms)
      // Ini memberi waktu halaman baru untuk render di balik layar
      setTimeout(() => {
        setIsLoading(false);
      }, 500); 
    }, 10);
  };

  return navigateWithLoad;
};