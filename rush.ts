import { Type } from "@sinclair/typebox";
import { images, is_translation_unofficial, localesNullableString, name, Nullable, sets } from "./common";

enum SpellType {
	Normal = "Normal",
	Field = "Field",
	Equip = "Equip",
	Ritual = "Ritual"
}

const base = {
	konami_id: Nullable(Type.Integer({ minimum: 0 })),
	yugipedia_page_id: Type.Integer({ minimum: 0 }),
	name,
	legend: Type.Optional(Type.Literal(true)),
	sets,
	images,
	is_translation_unofficial
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

const NonEffectMonsterCardSchema = Type.Object({
	...baseMonster,
	text: Type.Object(localesNullableString)
});

const MainDeckEffectMonsterCardSchema = Type.Object({
	...baseMonster,
	// if present then summoning_condition will be present
	maximum_atk: Type.Optional(Type.Integer({ minimum: 0 })),
	// present for Maximum Monsters and others like Cyber Dragon
	summoning_condition: Type.Optional(Type.Object(localesNullableString)),
	requirement: Type.Object(localesNullableString),
	// if summoning_condition is present then contains "Summoning condition"
	// also may contain "Continuous" or "Multi-Choice"
	effect_types: Type.Optional(Type.Array(Type.String({ minLength: 1 }), { minItems: 1 })),
	effect: Type.Object(localesNullableString)
});

const FusionEffectMonsterCardSchema = Type.Object({
	...baseMonster,
	materials: Type.Object(localesNullableString),
	requirement: Type.Object(localesNullableString),
	// if summoning_condition is present then contains "Summoning condition"
	// also may contain "Continuous" or "Multi-Choice"
	effect_types: Type.Optional(Type.Array(Type.String({ minLength: 1 }), { minItems: 1 })),
	effect: Type.Object(localesNullableString)
});

const SpellCardSchema = Type.Object({
	...base,
	card_type: Type.Literal("Spell"),
	property: Type.Enum(SpellType),
	requirement: Type.Object(localesNullableString),
	effect: Type.Object(localesNullableString)
});

const TrapCardSchema = Type.Object({
	...base,
	card_type: Type.Literal("Trap"),
	property: Type.Literal("Normal"),
	requirement: Type.Object(localesNullableString),
	effect: Type.Object(localesNullableString)
});

export const RushCardSchema = Type.Union(
	// Schema match priority is in array order. Be careful due to the similarity in shapes
	[
		FusionEffectMonsterCardSchema,
		NonEffectMonsterCardSchema,
		MainDeckEffectMonsterCardSchema,
		SpellCardSchema,
		TrapCardSchema
	],
	{ $id: "/rush/card.json" }
);
