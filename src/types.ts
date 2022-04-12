export type Entity = {
	update: (updateParams: UpdateParams) => void;
}

export type UpdateParams = {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	delta: number
}

export type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export type Vector = { x: number; y: number };

export type AvailableEvents = 'triggerNextRoom';
export type AvailableEventPayload = Vector

export type Parent = {
	callEvent: (event: AvailableEvents, argument: AvailableEventPayload) => void,
	registerSprite: (sprite: Phaser.Physics.Arcade.Sprite) => void,
	registerEntity: (entity: Entity) => void,
} & Entity;
