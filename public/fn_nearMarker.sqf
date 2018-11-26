/*
# Description: Used for checking if a player is near a marker.
# Author: Kerkkoh
# Param: {integer} {_distance} {Distance where player is "near" the marker}
# Param: {marker} {_area} {Marker to check the player's distance against}
*/
params ["_distance", "_area"];

private _return = ((player distance (getMarkerPos _area)) <= _distance);

_return;
