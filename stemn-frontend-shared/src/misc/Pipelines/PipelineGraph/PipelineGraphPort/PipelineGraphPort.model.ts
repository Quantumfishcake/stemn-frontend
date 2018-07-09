import { merge } from 'lodash'
import { LinkModel, DiagramEngine, PortModel, DefaultLinkModel } from 'mrblenny-storm-react-diagrams'

export class PipelineGraphPortModel extends PortModel {
	position: string | "top" | "bottom" | "left" | "right";

	constructor(pos: string = "top") {
		super(pos, "diamond");
		this.position = pos;
	}

	serialize() {
		return merge(super.serialize(), {
			position: this.position
		});
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.position = data.position;
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}