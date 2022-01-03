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
	// TODO: extend to -1 for ?
	atk: Type.Integer({ minimum: 0 }),
	// always false for Fusions due to a data bug
	tuner: Type.Boolean(),
	// Presence indicates Pendulum property, too annoying to do a schema with it mixed in all the types
	scale: Type.Optional(Type.Integer({ minimum: 0, maximum: 13 }))
};

const withLevel = {
	// refers to the printed number of stars, regardless of gameplay (Ultimaya)
	level: Type.Integer({ minimum: 0, maximum: 12 }),
	// TODO: extend to -1 for ?
	def: Type.Integer({ minimum: 0 })
};

const xyz = {
	subtype: Type.Literal("Xyz"),
	// refers to the printed number of stars, regardless of gameplay (F0, iC1000)
	rank: Type.Integer({ minimum: 0, maximum: 13 }),
	// TODO: extend to -1 for ?
	def: Type.Integer({ minimum: 0 })
};

// The Unicode arrows that correspond to emoji
export enum LinkArrow {
	"Bottom-Left" = "↙",
	Bottom = "⬇",
	"Bottom-Right" = "↘",
	Left = "⬅",
	Right = "➡",
	"Top-Left" = "↖",
	Top = "⬆",
	"Top-Right" = "↗"
}

const link = {
	subtype: Type.Literal("Link"),
	link: Type.Integer({ minimum: 1, maximum: 8 }),
	arrows: Type.Array(Type.Enum(LinkArrow), { minItems: 1, maxItems: 8 }) // same number of elements as specified by `link`
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

export enum TrapType {
	Normal = "Normal",
	Continuous = "Continuous",
	Counter = "Counter"
}

const NormalMonsterCardSchema = Type.Object({
	...baseMonster,
	...withLevel,
	effect: Type.Literal(false),
	subtype: Type.Literal("Normal")
});
const TokenCardSchema = Type.Object({
	...baseMonster,
	...withLevel,
	effect: Type.Literal(false),
	subtype: Type.Literal("Token")
});
const OrangeMonsterCardSchema = Type.Object({
	...baseMonster,
	...withLevel,
	effect: Type.Literal(true),
	subtype: Type.Null()
});
const RitualMonsterCardSchema = Type.Object({
	...baseMonster,
	...withLevel,
	effect: Type.Boolean(),
	subtype: Type.Literal("Ritual")
});
const FusionMonsterCardSchema = Type.Object({
	...baseMonster,
	...withLevel,
	effect: Type.Boolean(),
	subtype: Type.Literal("Fusion")
});
const SynchroMonsterCardSchema = Type.Object({
	...baseMonster,
	...withLevel,
	effect: Type.Boolean(),
	subtype: Type.Literal("Synchro")
});
const XyzMonsterCardSchema = Type.Object({ ...baseMonster, effect: Type.Boolean(), ...xyz });
const LinkMonsterCardSchema = Type.Object({ ...baseMonster, effect: Type.Boolean(), ...link });
const SpellCardSchema = Type.Object({ ...base, type: Type.Literal("Spell"), subtype: Type.Enum(SpellType) });
const TrapCardSchema = Type.Object({ ...base, type: Type.Literal("Trap"), subtype: Type.Enum(TrapType) });

export const CardSchema = Type.Union(
	[
		NormalMonsterCardSchema,
		TokenCardSchema,
		OrangeMonsterCardSchema,
		RitualMonsterCardSchema,
		FusionMonsterCardSchema,
		SynchroMonsterCardSchema,
		XyzMonsterCardSchema,
		LinkMonsterCardSchema,
		SpellCardSchema,
		TrapCardSchema
	],
	{ $id: "https://api.alphakretin.com/card.json" }
);
