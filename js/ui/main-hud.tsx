import { ServiceLocator } from '@sorskoot/wonderland-components';
import { Material, Texture } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { GlobalEvents } from '../classes/GlobalEvents.js';
import {
    Align,
    Justify,
    ReactUiBase,
    ThemeProvider,
} from '@wonderlandengine/react-ui';
import {
    MaterialContext,
    Panel,
    Text,
    Button,
    Column,
    Row,
    Container,
    Panel9Slice,
} from '@wonderlandengine/react-ui/components';
import React from 'react';

const App = (props: { comp: MainHUD }) => {
    const onclick = (e: MouseEvent, payload: string) => {
        // prevent objects from being placed
        e.stopImmediatePropagation();
        ServiceLocator.get(GlobalEvents).BuildingSelectionChanged.notify(
            payload
        );
        //._globalEvents.BuildingSelectionChanged.notify(payload);
    };
    const theme = {
        components: {
            panel9Slice: {
                borderTextureSize: 0.1,
                borderSize: 10,
            },
            text: {
                z: 0.001,
            },
        },
        variants: {
            metal: {
                components: {
                    panel9Slice: {
                        texture: props.comp.metalBackground,
                    },
                },
            },
            toolbarbutton: {
                components: {
                    button: {
                        nineSlice: true,
                        texture: props.comp.blueButton,
                        borderTextureSize: 0.3,
                        borderSize: 5,
                        width: 100,
                        height: 60,
                        hovered: { texture: props.comp.yellowButton },
                        padding: 5,
                        rounding: 2,
                        justifyContent: Justify.Center,
                        alignItems: Align.Center,
                    },
                    text: {
                        fontSize: 10,
                        textAlign: 'center',
                    },
                },
            },
        },
    };

    return (
        <MaterialContext.Provider value={props.comp}>
            <ThemeProvider theme={theme}>
                <Container
                    width="100%"
                    height="100%"
                    alignItems={Align.Center}
                    justifyContent={Justify.FlexEnd}
                >
                    <Panel9Slice
                        variant="metal"
                        width={500}
                        height={100}
                        margin={20}
                        onMove={(data) => data.e.stopImmediatePropagation()}
                    >
                        <Row
                            justifyContent={Justify.SpaceEvenly}
                            alignItems={Align.Center}
                            width="100%"
                            height="100%"
                        >
                            <Button
                                variant="toolbarbutton"
                                onClick={(data) => {
                                    onclick(data.e, 'miner');
                                }}
                            >
                                <Text>miner</Text>
                            </Button>
                            <Button
                                variant="toolbarbutton"
                                onClick={(data) => {
                                    onclick(data.e, 'conveyor');
                                }}
                            >
                                <Text>belt</Text>
                            </Button>
                            <Button
                                variant="toolbarbutton"
                                onClick={(data) => {
                                    onclick(data.e, 'processor');
                                }}
                            >
                                <Text>processor</Text>
                            </Button>
                            <Button
                                variant="toolbarbutton"
                                onClick={(data) => {
                                    onclick(data.e, 'storage');
                                }}
                            >
                                <Text>storage</Text>
                            </Button>
                        </Row>
                    </Panel9Slice>
                </Container>
            </ThemeProvider>
        </MaterialContext.Provider>
    );
};

export class MainHUD extends ReactUiBase {
    static TypeName = 'main-hud';
    static InheritProperties = true;

    //@ts-ignore Because nightly
    @property.texture()
    metalBackground?: Texture;
    //@ts-ignore Because nightly
    @property.texture()
    blueButton?: Texture;
    //@ts-ignore Because nightly
    @property.texture()
    yellowButton?: Texture;

    render() {
        return <App comp={this} />;
    }
}
