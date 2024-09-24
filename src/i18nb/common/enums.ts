export const GROUP_OPT_TYPES = {
	cardinal: 0,
	ordinal: 1,
	// overflow: 31
};

export const PLACEHOLDER_TYPES = {
	slot: 0,
	$t: 1,
	// overflow: 31
	// >=32: variable
	JSON: 123, // {
};

export const SEGMENT_TYPES = {
	text: 0,
	variable: 1,
	slot: 2,
	$t: 3, // getter
	JSON: 123, // { - custom getter
};