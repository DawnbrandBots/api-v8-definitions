import { TSchema, Type } from "@sinclair/typebox";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export const LOCALES = [
	"en", // English
	"de", // German
	"es", // Spanish
	"fr", // French
	"it", // Italian
	"pt", // Portuguese
	"ja", // Japanese
	"ko", // Korean
	"zh-CN", // Simplified Chinese
	"zh-TW" // Traditional Chinese
] as const;

const locales = {
	en: Nullable(Type.String()),
	de: Nullable(Type.String()),
	es: Nullable(Type.String()),
	fr: Nullable(Type.String()),
	it: Nullable(Type.String()),
	pt: Nullable(Type.String()),
	ja: Nullable(Type.String()),
	ko: Nullable(Type.String()),
	"zh-CN": Nullable(Type.String()),
	"zh-TW": Nullable(Type.String())
};

export const CardSet = Type.Object({
	set_number: Type.String(),
	set_name: Type.String(),
	// could be enum but who knows
	rarities: Nullable(Type.Array(Type.String()))
});

export const CardSetList = Type.Optional(Type.Array(CardSet));

const base = {
	konami_id: Nullable(Type.Integer({ minimum: 0 })),
	password: Nullable(Type.Integer({ minimum: 0 })),
	name: Type.Object({
		...locales,
		ja_romaji: Nullable(Type.String()),
		ko_rr: Nullable(Type.String())
	}),
	text: Type.Object(locales),
	sets: Type.Object({
		en: CardSetList,
		de: CardSetList,
		es: CardSetList,
		fr: CardSetList,
		it: CardSetList,
		pt: CardSetList,
		ja: CardSetList,
		ko: CardSetList,
		"zh-CN": CardSetList,
		"zh-TW": CardSetList
	})
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

export const MonsterPoints = Type.Union([Type.Integer({ minimum: 0 }), Type.Literal("?")]);

const baseMonster = {
	...base,
	card_type: Type.Literal("Monster"),
	monster_type_line: Type.String(),
	attribute: Type.Enum(Attribute),
	atk: MonsterPoints,
	// both or neither
	pendulum_scale: Type.Optional(Type.Integer({ minimum: 0, maximum: 13 })),
	pendulum_effect: Type.Optional(Type.Object(locales))
};

const withLevel = {
	// refers to the printed number of stars, regardless of gameplay (e.g. Ultimaya)
	level: Type.Integer({ minimum: 0, maximum: 12 }),
	def: MonsterPoints
};

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

// Normal, Orange Effect, Ritual
const MainDeckMonsterWithLevelCardSchema = Type.Object({
	...baseMonster,
	...withLevel,
	ritual_spell: Type.Optional(Type.String())
});
// Fusion, Synchro
const ExtraDeckMonsterWithLevelCardSchema = Type.Object({
	...baseMonster,
	...withLevel,
	materials: Type.String()
});
const XyzMonsterCardSchema = Type.Object({
	...baseMonster,
	// refers to the printed number of stars, regardless of gameplay (e.g. F0, iC1000)
	rank: Type.Integer({ minimum: 0, maximum: 13 }),
	def: MonsterPoints
});
const LinkMonsterCardSchema = Type.Object({
	...baseMonster,
	// elements are unique
	link_arrows: Type.Array(Type.Enum(LinkArrow), { minItems: 1, maxItems: 8 })
});
const SpellCardSchema = Type.Object({ ...base, card_type: Type.Literal("Spell"), property: Type.Enum(SpellType) });
const TrapCardSchema = Type.Object({ ...base, card_type: Type.Literal("Trap"), property: Type.Enum(TrapType) });

export const CardSchema = Type.Union(
	[
		MainDeckMonsterWithLevelCardSchema,
		ExtraDeckMonsterWithLevelCardSchema,
		XyzMonsterCardSchema,
		LinkMonsterCardSchema,
		SpellCardSchema,
		TrapCardSchema
	],
	{ $id: "https://api.alphakretin.com/yaml-yugi/card.json" }
);
