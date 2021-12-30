import { TSchema, Type } from "@sinclair/typebox";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export const CardText = Type.Object(
	{
		name: Type.String(),
		description: Type.String(),
		pendulum: Type.Optional(Type.String())
	},
	{ $id: "https://api.alphakretin.com/card-text.json" }
);

const base = {
	password: Type.Integer(),
	kid: Nullable(Type.Integer()), // constrain minimum in the future when data not bugged

	// TODO: make on-demand if we get performance issues
	en: CardText,
	fr: Type.Optional(CardText),
	de: Type.Optional(CardText),
	it: Type.Optional(CardText),
	pt: Type.Optional(CardText),
	// es, ja, ko, zh

	sets: Type.Array(
		Type.Object({
			// These shouldn't be optional but the database often has mismatches in its raw delimited form
			tag: Type.Optional(Type.String()), // Card Number
			name: Type.Optional(Type.String())
		})
	),

	// extra temporaries
	format: Nullable(Type.String()),
	archetypes: Nullable(Type.String()),
	releaseTCG: Nullable(Type.String()),
	releaseOCG: Nullable(Type.String()),
	statusTCG: Nullable(Type.String()),
	statusOCG: Nullable(Type.String())
};

export enum Attribute {
	LIGHT = "LIGHT",
	DARK = "DARK",
	EARTH = "EARTH",
	WIND = "WIND",
	WATER = "WATER",
	FIRE = "FIRE",
	DIVINE = "DIVINE"
}

export enum Race {
	Aqua = "Aqua",
	Beast = "Beast",
	BeastWarrior = "Beast-Warrior",
	CreatorGod = "Creator-God",
	Cyberse = "Cyberse",
	Dinosaur = "Dinosaur",
	DivineBeast = "Divine-Beast",
	Dragon = "Dragon",
	Fairy = "Fairy",
	Fiend = "Fiend",
	Fish = "Fish",
	Insect = "Insect",
	Machine = "Machine",
	Plant = "Plant",
	Psychic = "Psychic",
	Pyro = "Pyro",
	Reptile = "Reptile",
	Rock = "Rock",
	SeaSerpent = "Sea Serpent",
	Spellcaster = "Spellcaster",
	Thunder = "Thunder",
	Warrior = "Warrior",
	WingedBeast = "Winged Beast",
	Wyrm = "Wyrm",
	Zombie = "Zombie"
}

// This name is not official and is only used in the OCG
enum Ability {
	// Not actually abilities, but we have too many "types" going on that all appear on the same line
	Normal = "Normal",
	Effect = "Effect",
	Tuner = "Tuner",
	// Not even a card
	Token = "Token",
	// Special Summon
	// Actual abilities, which seem to be mutually exclusive
	Flip = "Flip",
	Toon = "Toon",
	Spirit = "Spirit",
	Union = "Union",
	Gemini = "Gemini"
}

const baseMonster = {
	...base,
	type: Type.Literal("Monster"),
	// Meant to an array of the literal type line on the card split on slashes because
	// it's so confusing. Currently the YGOPRODECK-provided custom value.
	typeline: Type.String(),
	attribute: Type.Enum(Attribute),
	race: Type.Enum(Race),
	atk: Type.Integer({ minimum: 0 }),
	// always false for Fusions due to a data bug
	tuner: Type.Boolean(),
	// Presence indicates Pendulum property, too annoying to do a schema with it mixed in all the types
	scale: Type.Optional(Type.Integer({ minimum: 0, maximum: 13 }))
};

const withLevel = {
	// refers to the printed number of stars, regardless of gameplay (Ultimaya)
	level: Type.Integer({ minimum: 0, maximum: 12 }),
	def: Type.Integer({ minimum: 0 })
};

const xyz = {
	subtype: Type.Literal("Xyz"),
	// refers to the printed number of stars, regardless of gameplay (F0, iC1000)
	rank: Type.Integer({ minimum: 0, maximum: 13 }),
	def: Type.Integer({ minimum: 0 })
};

const link = {
	subtype: Type.Literal("Link"),
	link: Type.Integer({ minimum: 1, maximum: 8 }),
	arrows: Type.Array(Type.String()) // same number of elements as specified by `link`
};

export enum SpellType {
	Normal = "Normal",
	Continuous = "Continuous",
	Field = "Field",
	Equip = "Equip",
	QuickPlay = "Quick-Play",
	Ritual = "Ritual"
	// Link
}

const spell = {
	type: Type.Literal("Spell"),
	subtype: Type.Enum(SpellType)
};

export enum TrapType {
	Normal = "Normal",
	Continuous = "Continuous",
	Counter = "Counter"
}

const trap = {
	type: Type.Literal("Trap"),
	subtype: Type.Enum(TrapType)
};

export const CardSchema = Type.Union(
	[
		Type.Union([
			Type.Object(
				{ ...baseMonster, ...withLevel, effect: Type.Literal(false), subtype: Type.Literal("Normal") },
				{ $id: "https://api.alphakretin.com/normal-monster-card.json" }
			),
			Type.Object(
				{ ...baseMonster, ...withLevel, effect: Type.Literal(false), subtype: Type.Literal("Token") },
				{ $id: "https://api.alphakretin.com/token-card.json" }
			),
			Type.Object(
				{ ...baseMonster, ...withLevel, effect: Type.Literal(true), subtype: Type.Null() },
				{ $id: "https://api.alphakretin.com/orange-monster-card.json" }
			), // orange-coloured cards
			Type.Object(
				{ ...baseMonster, ...withLevel, effect: Type.Boolean(), subtype: Type.Literal("Ritual") },
				{ $id: "https://api.alphakretin.com/ritual-monster-card.json" }
			),
			Type.Object(
				{ ...baseMonster, ...withLevel, effect: Type.Boolean(), subtype: Type.Literal("Fusion") },
				{ $id: "https://api.alphakretin.com/fusion-monster-card.json" }
			),
			Type.Object(
				{ ...baseMonster, ...withLevel, effect: Type.Boolean(), subtype: Type.Literal("Synchro") },
				{ $id: "https://api.alphakretin.com/synchro-monster-card.json" }
			),
			Type.Object(
				{ ...baseMonster, effect: Type.Boolean(), ...xyz },
				{ $id: "https://api.alphakretin.com/xyz-monster-card.json" }
			),
			Type.Object(
				{ ...baseMonster, effect: Type.Boolean(), ...link },
				{ $id: "https://api.alphakretin.com/link-monster-card.json" }
			)
		]),
		Type.Object({ ...base, ...spell }, { $id: "https://api.alphakretin.com/spell-card.json" }),
		Type.Object({ ...base, ...trap }, { $id: "https://api.alphakretin.com/trap-card.json" })
	],
	{ $id: "https://api.alphakretin.com/card.json" }
);
