const CHOLoadingApp = () => {
    const [activeDay, setActiveDay] = useState(1);
    const [bodyMass, setBodyMass] = useState({ total: 0, lean: 0 });
    const [unit, setUnit] = useState('Kg');
    const [meals, setMeals] = useState({
        1: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [], snack3: [] },
        2: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [], snack3: [] }
    });

    const foodsDatabase = window.FoodsDatabase || [];

    const calculateTargets = () => {
        const totalMass = unit === 'Kg' ? bodyMass.total : bodyMass.total / 2.2046;
        const leanMass = unit === 'Kg' ? bodyMass.lean : bodyMass.lean / 2.2046;
        return {
            carbs: { min: 7 * leanMass, max: 12 * leanMass },
            energy: { min: 225 * totalMass, max: 250 * totalMass },
            protein: { min: 0.8 * totalMass, max: 2 * totalMass },
            fibre: { min: 0, max: 30 },
            fat: { min: 0, max: 80 }
        };
    };

    const calculateTotals = (dayMeals) => {
        let totals = { carbs: 0, energyKJ: 0, energyKcal: 0, protein: 0, fat: 0, fibre: 0 };
        Object.values(dayMeals).forEach(mealItems => {
            mealItems.forEach(item => {
                const food = foodsDatabase.find(f => f.name === item.food);
                if (food) {
                    totals.carbs += (food.carbs * item.quantity);
                    totals.energyKJ += (food.energyKJ * item.quantity);
                    totals.energyKcal += (food.energyKcal * item.quantity);
                    totals.protein += (food.protein * item.quantity);
                    totals.fat += (food.fat * item.quantity);
                    totals.fibre += (food.fibre * item.quantity);
                }
            });
        });
        return totals;
    };

    const addFoodItem = (meal, food, quantity) => {
        setMeals(prev => ({
            ...prev,
            [activeDay]: {
                ...prev[activeDay],
                [meal]: [...prev[activeDay][meal], { food: food.name, quantity: parseFloat(quantity) || 1 }]
            }
        }));
    };

    const removeFoodItem = (meal, index) => {
        setMeals(prev => ({
            ...prev,
            [activeDay]: {
                ...prev[activeDay],
                [meal]: prev[activeDay][meal].filter((_, i) => i !== index)
            }
        }));
    };

    const targets = calculateTargets();
    const totals = calculateTotals(meals[activeDay]);
    const totalMass = unit === 'Kg' ? bodyMass.total : bodyMass.total / 2.2046;
    const leanMass = unit === 'Kg' ? bodyMass.lean : bodyMass.lean / 2.2046;

    const ratios = {
        carbsPerKgLean: leanMass > 0 ? totals.carbs / leanMass : 0,
        energyPerKgTotal: totalMass > 0 ? totals.energyKJ / totalMass : 0,
        proteinPerKgTotal: totalMass > 0 ? totals.protein / totalMass : 0
    };

    return (
        <div className="app-container">
            <div className="min-h-screen p-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    <Activity className="inline mr-3 text-blue-600" size={32} />
                                    TNA CHO Loading Plan
                                </h1>
                                <h2 className="text-xl text-gray-600">Carbohydrate Loading Plan</h2>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveDay(1)}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                        activeDay === 1 
                                            ? 'bg-blue-600 text-white shadow-lg' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Day 1
                                </button>
                                <button
                                    onClick={() => setActiveDay(2)}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                        activeDay === 2 
                                            ? 'bg-blue-600 text-white shadow-lg' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Day 2
                                </button>
                                <button
                                    onClick={() => window.authManager.logout()}
                                    className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Body Mass Input */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Body Mass Unit
                                </label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Kg">Kg (metric)</option>
                                    <option value="Lbs">Lbs (imperial)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Body Mass ({unit})
                                </label>
                                <input
                                    type="number"
                                    value={bodyMass.total}
                                    onChange={(e) => setBodyMass(prev => ({ ...prev, total: parseFloat(e.target.value) || 0 }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter total mass"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lean Body Mass ({unit})
                                </label>
                                <input
                                    type="number"
                                    value={bodyMass.lean}
                                    onChange={(e) => setBodyMass(prev => ({ ...prev, lean: parseFloat(e.target.value) || 0 }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter lean mass"
                                />
                            </div>
