import { Type } from "@sinclair/typebox";
import { CardSetList, locales, Nullable } from "./common";

enum SpellType {
	Normal = "Normal",
	Field = "Field",
	Equip = "Equip"
}

const base = {
	konami_id: Nullable(Type.Integer({ minimum: 0 })),
	yugipedia_page_id: Type.Integer({ minimum: 0 }),
	name: Type.Object({
		...locales,
		ja_romaji: Nullable(Type.String()),
		ko_rr: Nullable(Type.String())
	}),
	legend: Type.Optional(Type.Literal(true)),
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

enum Attribute {
	LIGHT = "LIGHT",
	DARK = "DARK",
	EARTH = "EARTH",
	WIND = "WIND",
	WATER = "WATER",
	FIRE = "FIRE"
}

const baseMonster = {
	...base,
	card_type: Type.Literal("Monster"),
	monster_type_line: Type.String(),
	attribute: Type.Enum(Attribute),
	level: Type.Integer({ minimum: 0, maximum: 12 }),
	atk: Type.Integer({ minimum: 0 }),
	def: Type.Integer({ minimum: 0 })
};

const effect = {
	requirement: Type.Object(locales),
	effect: Type.Object(locales)
};

const continuousEffect = {
	requirement: Type.Object(locales),
	continuous_effect: Type.Object(locales)
};

const maximum = {
	summoning_condition: Type.Object(locales),
	maximum_atk: Type.Integer({ minimum: 0 })
};

const fusion = {
	materials: Type.Object(locales)
};

const NormalMonsterCardSchema = Type.Object({
	...baseMonster,
	text: Type.Object(locales)
});

const MainDeckEffectMonsterCardSchema = Type.Object({
	...baseMonster,
	// if present then summoning_condition will be present
	maximum_atk: Type.Optional(Type.Integer({ minimum: 0 })),
	// present for Maximum Monsters and others like Cyber Dragon
	summoning_condition: Type.Optional(Type.Object(locales)),
	requirement: Type.Object(locales),
	// if summoning_condition is present then contains "Summoning condition"
	// also may contain "Continuous" or "Multi-Choice"
	effect_types: Type.Optional(Type.Array(Type.String({ minLength: 1 }), { minItems: 1 })),
	effect: Type.Object(locales)
});

const FusionNonEffectMonsterCardSchema = Type.Object({
	...baseMonster,
	materials: Type.Object(locales)
});

const FusionEffectMonsterCardSchema = Type.Object({
	...baseMonster,
	materials: Type.Object(locales),
	requirement: Type.Object(locales),
	// if summoning_condition is present then contains "Summoning condition"
	// also may contain "Continuous" or "Multi-Choice"
	effect_types: Type.Optional(Type.Array(Type.String({ minLength: 1 }), { minItems: 1 })),
	effect: Type.Object(locales)
});

const SpellCardSchema = Type.Object({
	...base,
	card_type: Type.Literal("Spell"),
	property: Type.Enum(SpellType),
	requirement: Type.Object(locales),
	effect: Type.Object(locales)
});

const TrapCardSchema = Type.Object({
	...base,
	card_type: Type.Literal("Trap"),
	property: Type.Literal("Normal"),
	requirement: Type.Object(locales),
	effect: Type.Object(locales)
});

export const RushCardSchema = Type.Union(
	[
		NormalMonsterCardSchema,
		MainDeckEffectMonsterCardSchema,
		FusionNonEffectMonsterCardSchema,
		FusionEffectMonsterCardSchema,
		SpellCardSchema,
		TrapCardSchema
	],
	{ $id: "/rush/card.json" }
);
