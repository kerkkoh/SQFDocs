/*
# Description: Used for drinking a drinkable item. Modifies thirst.
# Author: Kerkkoh
# Param: {string} {_item} {Item to be drunken}
*/
params ["_item"];

{
	if ((_x select 0) isEqualTo _item) then {
		private _newThirst = (player getVariable "thirst") - (_x select 1);
		if (_newThirst < 0) then {
			_newThirst = 0;
		};
		player setVariable ["thirst", _newThirst, true];
	};
	true;
}count RPF_Drinkables;

false
