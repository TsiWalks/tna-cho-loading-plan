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
            }, [
           React.createElement('div', {
               key: 'container',
               className: "max-w-6xl mx-auto"
           }, [
               // Header
               React.createElement('div', {
                   key: 'header',
                   className: "bg-white rounded-xl shadow-lg p-6 mb-6"
               }, [
                   React.createElement('div', {
                       key: 'header-content',
                       className: "flex items-center justify-between mb-4"
                   }, [
                       React.createElement('div', {
                           key: 'title-section'
                       }, [
                           React.createElement('h1', {
                               key: 'title',
                               className: "text-3xl font-bold text-gray-800 mb-2"
                           }, [
                               React.createElement(Activity, {
                                   key: 'icon',
                                   className: "inline mr-3 text-blue-600",
                                   size: 32
                               }),
                               'TNA CHO Loading Plan'
                           ]),
                           React.createElement('h2', {
                               key: 'subtitle',
                               className: "text-xl text-gray-600"
                           }, 'Carbohydrate Loading Plan')
                       ]),
                       React.createElement('div', {
                           key: 'day-buttons',
                           className: "flex gap-2"
                       }, [
                           React.createElement('button', {
                               key: 'day1',
                               onClick: () => setActiveDay(1),
                               className: `px-6 py-3 rounded-lg font-semibold transition-all ${
                                   activeDay === 1 
                                       ? 'bg-blue-600 text-white shadow-lg' 
                                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                               }`
                           }, 'Day 1'),
                           React.createElement('button', {
                               key: 'day2',
                               onClick: () => setActiveDay(2),
                               className: `px-6 py-3 rounded-lg font-semibold transition-all ${
                                   activeDay === 2 
                                       ? 'bg-blue-600 text-white shadow-lg' 
                                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                               }`
                           }, 'Day 2'),
                           React.createElement('button', {
                               key: 'logout',
                               onClick: () => window.authManager.logout(),
                               className: "px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                           }, React.createElement(LogOut, { size: 20 }))
                       ])
                   ]),

                   // Body Mass Input
                   React.createElement('div', {
                       key: 'body-mass',
                       className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg"
                   }, [
                       React.createElement('div', {
                           key: 'unit-select'
                       }, [
                           React.createElement('label', {
                               key: 'label',
                               className: "block text-sm font-medium text-gray-700 mb-2"
                           }, 'Body Mass Unit'),
                           React.createElement('select', {
                               key: 'select',
                               value: unit,
                               onChange: (e) => setUnit(e.target.value),
                               className: "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                           }, [
                               React.createElement('option', { key: 'kg', value: 'Kg' }, 'Kg (metric)'),
                               React.createElement('option', { key: 'lbs', value: 'Lbs' }, 'Lbs (imperial)')
                           ])
                       ]),
                       React.createElement('div', {
                           key: 'total-mass'
                       }, [
                           React.createElement('label', {
                               key: 'label',
                               className: "block text-sm font-medium text-gray-700 mb-2"
                           }, `Total Body Mass (${unit})`),
                           React.createElement('input', {
                               key: 'input',
                               type: 'number',
                               value: bodyMass.total,
                               onChange: (e) => setBodyMass(prev => ({ ...prev, total: parseFloat(e.target.value) || 0 })),
                               className: "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500",
                               placeholder: "Enter total mass"
                           })
                       ]),
                       React.createElement('div', {
                           key: 'lean-mass'
                       }, [
                           React.createElement('label', {
                               key: 'label',
                               className: "block text-sm font-medium text-gray-700 mb-2"
                           }, `Lean Body Mass (${unit})`),
                           React.createElement('input', {
                               key: 'input',
                               type: 'number',
                               value: bodyMass.lean,
                               onChange: (e) => setBodyMass(prev => ({ ...prev, lean: parseFloat(e.target.value) || 0 })),
                               className: "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500",
                               placeholder: "Enter lean mass"
                           })
                       ]),
                       React.createElement('div', {
                           key: 'conversion',
                           className: "text-sm text-gray-600"
                       }, [
                           React.createElement('div', { key: 'unit-label' }, `Other unit: ${unit === 'Kg' ? 'Lbs' : 'Kg'}`),
                           React.createElement('div', { key: 'total-conv' }, `Total: ${unit === 'Kg' ? (bodyMass.total * 2.2046).toFixed(1) : (bodyMass.total / 2.2046).toFixed(1)}`),
                           React.createElement('div', { key: 'lean-conv' }, `Lean: ${unit === 'Kg' ? (bodyMass.lean * 2.2046).toFixed(1) : (bodyMass.lean / 2.2046).toFixed(1)}`)
                       ])
                   ]),

                   // Targets
                   React.createElement('div', {
                       key: 'targets',
                       className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
                   }, [
                       React.createElement(TargetCard, {
                           key: 'carbs',
                           title: "Carbohydrates",
                           current: totals.carbs.toFixed(1),
                           target: `${targets.carbs.min.toFixed(0)}-${targets.carbs.max.toFixed(0)}`,
                           unit: "g",
                           subtitle: "Target 7-12 g/Kg lean mass",
                           inRange: totals.carbs >= targets.carbs.min && totals.carbs <= targets.carbs.max
                       }),
                       React.createElement(TargetCard, {
                           key: 'energy',
                           title: "Energy",
                           current: totals.energyKJ.toFixed(0),
                           target: `${targets.energy.min.toFixed(0)}-${targets.energy.max.toFixed(0)}`,
                           unit: "kJ",
                           subtitle: "Target 225-250 kJ/Kg total mass",
                           inRange: totals.energyKJ >= targets.energy.min && totals.energyKJ <= targets.energy.max
                       }),
                       React.createElement(TargetCard, {
                           key: 'protein',
                           title: "Protein",
                           current: totals.protein.toFixed(1),
                           target: `${targets.protein.min.toFixed(1)}-${targets.protein.max.toFixed(1)}`,
                           unit: "g",
                           subtitle: "Target 0.8-2 g/Kg total mass",
                           inRange: totals.protein >= targets.protein.min && totals.protein <= targets.protein.max
                       }),
                       React.createElement(TargetCard, {
                           key: 'fibre',
                           title: "Fibre",
                           current: totals.fibre.toFixed(1),
                           target: "<30",
                           unit: "g/day",
                           subtitle: "",
                           inRange: totals.fibre <= 30
                       }),
                       React.createElement(TargetCard, {
                           key: 'fat',
                           title: "Fat",
                           current: totals.fat.toFixed(1),
                           target: "<80",
                           unit: "g/day",
                           subtitle: "",
                           inRange: totals.fat <= 80
                       })
                   ])
               ]),

               // Meals and Summary
               React.createElement('div', {
                   key: 'content',
                   className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
               }, [
                   // Meals Section
                   React.createElement('div', {
                       key: 'meals',
                       className: "space-y-6"
                   }, Object.keys(meals[activeDay]).map(mealType => 
                       React.createElement(MealSection, {
                           key: mealType,
                           mealType: mealType,
                           items: meals[activeDay][mealType],
                           foodsDatabase: foodsDatabase,
                           onAddFood: addFoodItem,
                           onRemoveFood: removeFoodItem
                       })
                   )),

                   // Summary Panel
                   React.createElement('div', {
                       key: 'summary',
                       className: "lg:sticky lg:top-4 h-fit"
                   }, [
                       React.createElement('div', {
                           key: 'summary-card',
                           className: "bg-white rounded-xl shadow-lg p-6"
                       }, [
                           React.createElement('h3', {
                               key: 'summary-title',
                               className: "text-xl font-bold text-gray-800 mb-4 flex items-center"
                           }, [
                               React.createElement(Calculator, {
                                   key: 'icon',
                                   className: "mr-2 text-green-600",
                                   size: 24
                               }),
                               `Day ${activeDay} Summary`
                           ]),
                           
                           React.createElement('div', {
                               key: 'summary-stats',
                               className: "space-y-3"
                           }, [
                               React.createElement('div', {
                                   key: 'carbs',
                                   className: "flex justify-between"
                               }, [
                                   React.createElement('span', { key: 'label' }, 'Carbohydrates:'),
                                   React.createElement('span', { key: 'value', className: "font-bold" }, `${totals.carbs.toFixed(1)} g`)
                               ]),
                               React.createElement('div', {
                                   key: 'energy-kj',
                                   className: "flex justify-between"
                               }, [
                                   React.createElement('span', { key: 'label' }, 'Energy:'),
                                   React.createElement('span', { key: 'value', className: "font-bold" }, `${totals.energyKJ.toFixed(0)} kJ`)
                               ]),
                               React.createElement('div', {
                                   key: 'energy-kcal',
                                   className: "flex justify-between"
                               }, [
                                   React.createElement('span', { key: 'label' }, 'Energy:'),
                                   React.createElement('span', { key: 'value', className: "font-bold" }, `${totals.energyKcal.toFixed(0)} kcal`)
                               ]),
                               React.createElement('div', {
                                   key: 'protein',
                                   className: "flex justify-between"
                               }, [
                                   React.createElement('span', { key: 'label' }, 'Protein:'),
                                   React.createElement('span', { key: 'value', className: "font-bold" }, `${totals.protein.toFixed(1)} g`)
                               ]),
                               React.createElement('div', {
                                   key: 'fat',
                                   className: "flex justify-between"
                               }, [
                                   React.createElement('span', { key: 'label' }, 'Fat:'),
                                   React.createElement('span', { key: 'value', className: "font-bold" }, `${totals.fat.toFixed(1)} g`)
                               ]),
                               React.createElement('div', {
                                   key: 'fibre',
                                   className: "flex justify-between"
                               }, [
                                   React.createElement('span', { key: 'label' }, 'Fibre:'),
                                   React.createElement('span', { key: 'value', className: "font-bold" }, `${totals.fibre.toFixed(1)} g`)
                               ])
                           ]),

                           React.createElement('hr', {
                               key: 'divider',
                               className: "my-6"
                           }),

                           React.createElement('h4', {
                               key: 'ratios-title',
                               className: "font-semibold text-gray-800 mb-3 flex items-center"
                           }, [
                               React.createElement(Target, {
                                   key: 'icon',
                                   className: "mr-2 text-blue-600",
                                   size: 20
                               }),
                               'Performance Ratios'
                           ]),
                           
                           React.createElement('div', {
                               key: 'ratios',
                               className: "space-y-3"
                           }, [
                               React.createElement('div', {
                                   key: 'cho-ratio',
                                   className: "flex justify-between items-center"
                               }, [
                                   React.createElement('span', {
                                       key: 'label',
                                       className: "text-sm text-gray-600"
                                   }, 'CHO per kg lean mass:'),
                                   React.createElement('span', {
                                       key: 'value',
                                       className: `font-medium ${ratios.carbsPerKgLean >= 7 && ratios.carbsPerKgLean <= 12 ? 'text-green-600' : 'text-orange-600'}`
                                   }, `${ratios.carbsPerKgLean.toFixed(1)} g/kg`)
                               ]),
                               React.createElement('div', {
                                   key: 'energy-ratio',
                                   className: "flex justify-between items-center"
                               }, [
                                   React.createElement('span', {
                                       key: 'label',
                                       className: "text-sm text-gray-600"
                                   }, 'Energy per kg total mass:'),
                                   React.createElement('span', {
                                       key: 'value',
                                       className: `font-medium ${ratios.energyPerKgTotal >= 225 && ratios.energyPerKgTotal <= 250 ? 'text-green-600' : 'text-orange-600'}`
                                   }, `${ratios.energyPerKgTotal.toFixed(0)} kJ/kg`)
                               ]),
                               React.createElement('div', {
                                   key: 'protein-ratio',
                                   className: "flex justify-between items-center"
                               }, [
                                   React.createElement('span', {
                                       key: 'label',
                                       className: "text-sm text-gray-600"
                                   }, 'Protein per kg total mass:'),
                                   React.createElement('span', {
                                       key: 'value',
                                       className: `font-medium ${ratios.proteinPerKgTotal >= 0.8 && ratios.proteinPerKgTotal <= 2 ? 'text-green-600' : 'text-orange-600'}`
                                   }, `${ratios.proteinPerKgTotal.toFixed(1)} g/kg`)
                               ])
                           ])
                       ])
                   ])
               ])
           ])
       ])
   ]);
};

// Make the component globally available
window.CHOLoadingApp = CHOLoadingApp;
