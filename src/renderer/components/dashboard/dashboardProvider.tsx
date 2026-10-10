import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  DASHBOARD_SAFE_AREA_STORE_KEY,
  DEFAULT_DASHBOARD_SAFE_AREA,
  DashboardSafeArea,
} from './dashboardTypes';

interface DashboardContextValue {
  safeArea: DashboardSafeArea;

  setSafeArea: (safeArea: DashboardSafeArea) => Promise<void>;

  changeSide: (
    side: 'top' | 'right' | 'bottom' | 'left',
    amount: number,
  ) => Promise<void>;

  setBackground: (background: DashboardSafeArea['background']) => Promise<void>;

  resetSafeArea: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const { ipcRenderer } = window.electron;

  const [safeArea, setSafeAreaState] = useState<DashboardSafeArea>(
    DEFAULT_DASHBOARD_SAFE_AREA,
  );

  useEffect(() => {
    const loadSettings = async () => {
      const value = await ipcRenderer.invoke(
        'store-get',
        DASHBOARD_SAFE_AREA_STORE_KEY,
      );

      if (value) {
        setSafeAreaState({
          ...DEFAULT_DASHBOARD_SAFE_AREA,
          ...value,
        });
      }
    };

    loadSettings();
  }, [ipcRenderer]);

  const setSafeArea = useCallback(
    async (next: DashboardSafeArea) => {
      setSafeAreaState(next);

      await ipcRenderer.invoke('store-set', [
        DASHBOARD_SAFE_AREA_STORE_KEY,
        next,
      ]);
    },
    [ipcRenderer],
  );

  const changeSide = useCallback(
    async (side: 'top' | 'right' | 'bottom' | 'left', amount: number) => {
      const next: DashboardSafeArea = {
        ...safeArea,
        [side]: Math.max(0, safeArea[side] + amount),
      };

      await setSafeArea(next);
    },
    [safeArea, setSafeArea],
  );

  const setBackground = useCallback(
    async (background: DashboardSafeArea['background']) => {
      await setSafeArea({
        ...safeArea,
        background,
      });
    },
    [safeArea, setSafeArea],
  );

  const resetSafeArea = useCallback(async () => {
    await setSafeArea(DEFAULT_DASHBOARD_SAFE_AREA);
  }, [setSafeArea]);

  const insetBackground =
    safeArea.background === 'black' ? '#000000' : 'transparent';

  return (
    <DashboardContext.Provider
      value={{
        safeArea,
        setSafeArea,
        changeSide,
        setBackground,
        resetSafeArea,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        {/* Actual application viewport */}
        <div
          style={{
            position: 'absolute',
            top: safeArea.top,
            right: safeArea.right,
            bottom: safeArea.bottom,
            left: safeArea.left,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>

        {/* Top inset */}
        {safeArea.top > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: safeArea.top,
              background: insetBackground,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Bottom inset */}
        {safeArea.bottom > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: safeArea.bottom,
              background: insetBackground,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Left inset */}
        {safeArea.left > 0 && (
          <div
            style={{
              position: 'absolute',
              top: safeArea.top,
              bottom: safeArea.bottom,
              left: 0,
              width: safeArea.left,
              background: insetBackground,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Right inset */}
        {safeArea.right > 0 && (
          <div
            style={{
              position: 'absolute',
              top: safeArea.top,
              bottom: safeArea.bottom,
              right: 0,
              width: safeArea.right,
              background: insetBackground,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used inside DashboardProvider');
  }

  return context;
}
