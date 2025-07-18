const { useState, useEffect } = React;
const { Plus, Trash2, Calculator, Target, Activity, LogOut } = window.lucideReact;

// Meal Section Component
const MealSection = ({ mealType, items, foodsDatabase, onAddFood, onRemoveFood }) => {
    const [selectedFood, setSelectedFood] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllFoods, setShowAllFoods] = useState(false);

    const mealNames = {
        breakfast: 'Breakfast',
        snack1: 'Snack 1',
        lunch: 'Lunch',
        snack2: 'Snack 2',
        dinner: 'Dinner',
        snack3: 'Snack 3 (optional)'
    };

    const filteredFoods = searchTerm 
        ? foodsDatabase.filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : foodsDatabase;

    const handleAddFood = () => {
        const food = foodsDatabase.find(f => f.name === selectedFood);
        if (food && quantity > 0) {
            onAddFood(mealType, food, quantity);
            setSelectedFood('');
            setQuantity(1);
            setSearchTerm('');
            setShowAllFoods(false);
        }
    };

    return React.createElement('div', {
        className: "bg-white rounded-xl shadow-lg p-6"
    }, [
        React.createElement('h3', {
            key: 'title',
            className: "text-lg font-bold text-gray-800 mb-4"
        }, mealNames[mealType]),
        
        React.createElement('div', {
            key: 'controls',
            className: "space-y-4 mb-4 p-4 bg-gray-50 rounded-lg"
        }, [
            React.createElement('div', {
                key: 'buttons',
                className: "flex gap-2"
            }, [
                React.createElement('button', {
                    key: 'search-btn',
                    onClick: () => {
                        setShowAllFoods(false);
                        setSearchTerm('');
                    },
                    className: `px-3 py-2 rounded-md text-sm font-medium ${
                        !showAllFoods ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`
                }, 'Search Foods'),
                React.createElement('button', {
                    key: 'browse-btn',
                    onClick: () => {
                        setShowAllFoods(true);
                        setSearchTerm('');
                    },
                    className: `px-3 py-2 rounded-md text-sm font-medium ${
                        showAllFoods ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`
                }, `Browse All Foods (${foodsDatabase.length})`)
            ]),
            
            !showAllFoods && React.createElement('input', {
                key: 'search-input',
                type: 'text',
                placeholder: 'Search foods...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            }),
            
            (searchTerm || showAllFoods) && React.createElement('select', {
                key: 'food-select',
                value: selectedFood,
                onChange: (e) => setSelectedFood(e.target.value),
                className: "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500",
                size: 8
            }, [
                React.createElement('option', {
                    key: 'default',
                    value: ''
                }, `Select from ${filteredFoods.length} foods...`),
                ...filteredFoods.map((food, index) => 
                    React.createElement('option', {
                        key: index,
                        value: food.name
                    }, `${food.name} - CHO: ${food.carbs}g, ${food.energyKcal}kcal`)
                )
            ]),
            
            React.createElement('div', {
                key: 'add-controls',
                className: "flex gap-2"
            }, [
                React.createElement('input', {
                    key: 'quantity',
                    type: 'number',
                    step: '0.1',
                    min: '0',
                    value: quantity,
                    onChange: (e) => setQuantity(parseFloat(e.target.value) || 1),
                    className: "flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500",
                    placeholder: "Quantity"
                }),
                React.createElement('button', {
                    key: 'add-btn',
                    onClick: handleAddFood,
                    disabled: !selectedFood,
                    className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 flex items-center"
                }, [
                    React.createElement(Plus, {
                        key: 'icon',
                        size: 16,
                        className: "mr-1"
                    }),
                    'Add'
                ])
            ])
        ]),
        
        React.createElement('div', {
            key: 'items',
            className: "space-y-2"
        }, [
            ...items.map((item, index) => {
                const food = foodsDatabase.find(f => f.name === item.food);
                if (!food) return null;

                return React.createElement('div', {
                    key: index,
                    className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                }, [
                    React.createElement('div', {
                        key: 'info',
                        className: "flex-1"
                    }, [
                        React.createElement('div', {
                            key: 'name',
                            className: "font-medium text-gray-800"
                        }, food.name),
                        React.createElement('div', {
                            key: 'details',
                            className: "text-sm text-gray-600"
                        }, `Qty: ${item.quantity} | CHO: ${(food.carbs * item.quantity).toFixed(1)}g | Energy: ${(food.energyKcal * item.quantity).toFixed(0)}kcal`)
                    ]),
                    React.createElement('button', {
                        key: 'remove',
                        onClick: () => onRemoveFood(mealType, index),
                        className: "ml-2 p-1 text-red-600 hover:text-red-800"
                    }, React.createElement(Trash2, { size: 16 }))
                ]);
            }),
            
            items.length === 0 && React.createElement('div', {
                key: 'empty',
                className: "text-center text-gray-500 py-4"
            }, 'No foods added yet. Use the form above to add foods.')
        ])
    ]);
};

// Target Card Component
const TargetCard = ({ title, current, target, unit, subtitle, inRange }) => {
    return React.createElement('div', {
        className: `p-4 rounded-lg border-2 ${inRange ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`
    }, [
        React.createElement('h4', {
            key: 'title',
            className: "font-semibold text-gray-800 text-sm mb-1"
        }, title),
        React.createElement('div', {
            key: 'value',
            className: "text-lg font-bold text-gray-900"
        }, `${current} ${unit}`),
        React.createElement('div', {
            key: 'target',
            className: "text-xs text-gray-600"
        }, `Target: ${target} ${unit}`),
        subtitle && React.createElement('div', {
            key: 'subtitle',
            className: "text-xs text-gray-500 mt-1"
        }, subtitle)
    ]);
};

// Main App Component
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

    return React.createElement('div', {
        className: "app-container"
    }, [
        React.createElement('div', {
            key: 'main',
            className: "min-h-screen p-4"
