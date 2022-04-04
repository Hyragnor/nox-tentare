export type Entity = {
	update: (updateParams: UpdateParams) => void;
}

export type UpdateParams = {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	delta: number
}

export type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export type Vector = { x: number; y: number };
