const { useState, useEffect } = React;
const { Plus, Trash2, Calculator, Target, Activity, LogOut } = lucideReact;

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

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{mealNames[mealType]}</h3>
            
            <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setShowAllFoods(false);
                            setSearchTerm('');
                        }}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            !showAllFoods ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Search Foods
                    </button>
                    <button
                        onClick={() => {
                            setShowAllFoods(true);
                            setSearchTerm('');
                        }}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            showAllFoods ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Browse All Foods ({foodsDatabase.length})
                    </button>
                </div>

                {!showAllFoods && (
                    <input
                        type="text"
                        placeholder="Search foods..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                )}
                
                {(searchTerm || showAllFoods) && (
                    <select
                        value={selectedFood}
                        onChange={(e) => setSelectedFood(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        size="8"
                    >
                        <option value="">Select from {filteredFoods.length} foods...</option>
                        {filteredFoods.map((food, index) => (
                            <option key={index} value={food.name}>
                                {food.name} - CHO: {food.carbs}g, {food.energyKcal}kcal
                            </option>
                        ))}
                    </select>
                )}
                
                <div className="flex gap-2">
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Quantity"
                    />
                    <button
                        onClick={handleAddFood}
                        disabled={!selectedFood}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 flex items-center"
                    >
                        <Plus size={16} className="mr-1" />
                        Add
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {items.map((item, index) => {
                    const food = foodsDatabase.find(f => f.name === item.food);
                    if (!food) return null;

                    return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">{food.name}</div>
                                <div className="text-sm text-gray-600">
                                    Qty: {item.quantity} | CHO: {(food.carbs * item.quantity).toFixed(1)}g | Energy: {(food.energyKcal * item.quantity).toFixed(0)}kcal
                                </div>
                            </div>
                            <button
                                onClick={() => onRemoveFood(mealType, index)}
                                className="ml-2 p-1 text-red-600 hover:text-red-800"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}
                
                {items.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                        No foods added yet. Use the form above to add foods.
                    </div>
                )}
            </div>
        </div>
    );
};

const TargetCard = ({ title, current, target, unit, subtitle, inRange }) => (
    <div className={`p-4 rounded-lg border-2 ${inRange ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <h4 className="font-semibold text-gray-800 text-sm mb-1">{title}</h4>
        <div className="text-lg font-bold text-gray-900">{current} {unit}</div>
        <div className="text-xs text-gray-600">Target: {target} {unit}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
);

const SummaryRow = ({ label, value, unit }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-600">{label}:</span>
        <span className="font-semibold text-gray-800">{value} {unit}</span>
    </div>
);
