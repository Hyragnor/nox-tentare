export type Entity = {
	update: (updateParams: UpdateParams) => void;
}

export type UpdateParams = {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
}

export type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export type Vector = { x: Number; y: Number };
