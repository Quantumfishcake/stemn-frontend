import { IPipelineConfig } from '../types'

export const pipelineConfigFixture: IPipelineConfig = {
  name: 'Some pipeline',
  steps: {
    some_step: {
      position: {
        x: 50,
        y: 50,
      },
      type: 'some_type',
      ports: {
        in: ['in'],
        out: ['out'],
      }
    },
    some_other_step: {
      type: 'some_other_type',
      position: {
        x: 200,
        y: 200,
      },
      ports: {
        in: ['in'],
        out: ['out'],
      }
    }
  },
  links: [{
    from: 'some_step.ports.out[0]',
    to: 'some_other_step.ports.in[0]',
  }]
}