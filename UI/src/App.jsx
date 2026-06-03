import { useState, useEffect } from 'react';
import { loadAllData } from './services/dataService.js';
import { seedPlan } from './layers/L3_composite/dietPlanOps.js';
import { useAuth } from './layers/L2_business/useAuth.js';
import { Sidebar } from './components/shared/Shell.jsx';
import AuthScreen from './components/screens/AuthScreen.jsx';
import IntakeScreen from './components/screens/IntakeScreen.jsx';
import HomeScreen from './components/screens/HomeScreen.jsx';
import RecipeScreen from './components/screens/RecipeScreen.jsx';
import CookingScreen from './components/screens/CookingScreen.jsx';
import { InventoryScreen, ShoppingScreen } from './components/screens/InventoryScreen.jsx';
import DietPlanScreen from './components/screens/DietPlanScreen.jsx';
import { ProfileScreen, OnboardingScreen } from './components/screens/ProfileScreen.jsx';

// ─────────────────────── LoadingScreen ─────────────── START ──────────────────
// calls:     none (presentational)
// called by: App (while appData is null)
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--paper)" }}>
      <div className="col" style={{ alignItems: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--line)", borderTopColor: "var(--brick)", animation: "spin 0.8s linear infinite" }}/>
        <div className="serif-it" style={{ color: "var(--ink-3)", fontSize: 16 }}>Setting the table…</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
// ─────────────────────── LoadingScreen ─────────────── END ────────────────────

// ─────────────────────── App ─────────────── START ──────────────────
// calls:     services/dataService: loadAllData
//            L3/dietPlanOps: seedPlan
//            L2/useAuth: user, loading, isLoggedIn, login, register, error, clearError
// called by: main.jsx (React root)
export default function App() {
  const { user, loading: authLoading, isLoggedIn, login, register, error: authError, clearError } = useAuth();

  const [appData,       setAppData]       = useState(null);
  const [route,         setRoute]         = useState('intake');
  const [recipe,        setRecipe]        = useState(null);
  const [plan,          setPlan]          = useState(null);
  const [showNutrition] = useState(true);

  useEffect(() => {
    loadAllData().then(data => {
      setAppData(data);
      setRecipe(data.recipes.find(r => r.id === 'biryani') ?? data.recipes[0]);
      setPlan(seedPlan(data.recipes));
    });
  }, []);

  if (!appData || !recipe || !plan || authLoading) return <LoadingScreen/>;

  // Show auth screen until the user is logged in
  if (!isLoggedIn) return <AuthScreen login={login} register={register} error={authError} clearError={clearError}/>;

  const openRecipe  = (r) => { setRecipe(r); setRoute('recipe'); };
  const openCooking = () => setRoute('cooking');
  const fullBleed   = route === 'cooking' || route === 'intake';

  let screen = null;
  if      (route === 'intake')    screen = <IntakeScreen   recipes={appData.recipes} onPick={openRecipe} openDiscover={() => setRoute('home')}/>;
  else if (route === 'home')      screen = <HomeScreen     recipes={appData.recipes} cuisines={appData.cuisines} courses={appData.courses} diets={appData.diets} showNutrition={showNutrition} openRecipe={openRecipe}/>;
  else if (route === 'recipe')    screen = <RecipeScreen   recipe={recipe} inventory={appData.inventory} cuisines={appData.cuisines} showNutrition={showNutrition} openCooking={openCooking}/>;
  else if (route === 'inventory') screen = <InventoryScreen inventory={appData.inventory}/>;
  else if (route === 'shopping')  screen = <ShoppingScreen plan={plan} inventory={appData.inventory}/>;
  else if (route === 'dietplan')  screen = <DietPlanScreen plan={plan} setPlan={setPlan} recipes={appData.recipes} dietTargets={appData.dietTargets} openRecipe={openRecipe}/>;
  else if (route === 'cooking')   screen = <CookingScreen  recipe={recipe} assistantLines={appData.assistantLines}/>;
  else if (route === 'profile')   screen = <ProfileScreen  recipe={recipe} cuisines={appData.cuisines}/>;
  else if (route === 'onboard')   screen = <OnboardingScreen cuisines={appData.cuisines}/>;

  return (
    <div className="app" data-palette="default" data-font="serif-classic" data-density="regular">
      {fullBleed ? (
        <>
          {route === 'cooking' && (
            <button onClick={() => setRoute('recipe')} style={{ position: "fixed", top: 18, left: 18, zIndex: 50, padding: "8px 14px", borderRadius: 6, background: "rgba(0,0,0,.5)", color: "rgba(255,255,255,.9)", border: "1px solid rgba(255,255,255,.18)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8 }}>
              ← Exit cooking
            </button>
          )}
          {screen}
        </>
      ) : (
        <div className="shell">
          <Sidebar route={route} setRoute={setRoute}/>
          {screen}
        </div>
      )}
    </div>
  );
}
// ─────────────────────── App ─────────────── END ────────────────────
