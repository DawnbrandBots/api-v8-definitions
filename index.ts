import { Type } from "@sinclair/typebox";
import { LOCALES, Nullable, images, is_translation_unofficial, localesNullableString, name, sets } from "./common";

export { LOCALES, Nullable };

export enum OCGLimitRegulation {
	Forbidden = "Forbidden",
	Limited = "Limited",
	SemiLimited = "Semi-Limited",
	Unlimited = "Unlimited",
	Unreleased = "Not yet released",
	// For most purposes equivalent to the above
	NotYetLegal = "Not yet legal"
}

export enum SpeedLimitRegulation {
	Forbidden = "Forbidden",
	Limited1 = "Limited 1",
	Limited2 = "Limited 2",
	Limited3 = "Limited 3",
	Unlimited = "Unlimited",
	Unreleased = "Not yet released",
	// For most purposes equivalent to the above
	NotYetLegal = "Not yet legal"
}

const base = {
	konami_id: Nullable(Type.Integer({ minimum: 0 })),
	password: Nullable(Type.Integer({ minimum: 0 })),
	fake_password: Type.Optional(
		Type.Union([Type.Integer({ minimum: 0 }), Type.Array(Type.Integer({ minimum: 0 }), { minItems: 1 })])
	),
	name,
	text: Type.Object(localesNullableString),
	sets,
	limit_regulation: Type.Object({
		// null = Not yet released, structure may be changed in the future
		tcg: Nullable(Type.Enum(OCGLimitRegulation)),
		ocg: Nullable(Type.Enum(OCGLimitRegulation)),
		speed: Type.Optional(Type.Enum(SpeedLimitRegulation))
	}),
	images,
	is_translation_unofficial
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
	pendulum_effect: Type.Optional(Type.Object(localesNullableString))
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
	{ $id: "/ocg-tcg/card.json" }
);
