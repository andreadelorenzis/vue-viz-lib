import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';

import { fn } from 'storybook/test';

import MyButton from '../components/MyButton.vue';

export default {
    title: 'Components/MyButton',
    component: MyButton,
    argTypes: {
        text: { control: 'text' },
    },
} as Meta<typeof MyButton>;

// Template function
const Template: StoryFn<typeof MyButton> = (args) => ({
    components: { MyButton },
    setup() {
        return { args };
    },
    template: '<MyButton v-bind="args" />',
});

// Stories
export const Primary = Template.bind({});
Primary.args = {
    text: 'Click Me',
};

export const Secondary = Template.bind({});
Secondary.args = {
    text: 'Secondary Button',
};