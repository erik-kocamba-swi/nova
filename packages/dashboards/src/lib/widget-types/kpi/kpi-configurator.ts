// tslint:disable:max-line-length
import { FormStackComponent } from "../../configurator/components/form-stack/form-stack.component";
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { BackgroundColorRulesConfigurationComponent } from "../../configurator/components/widgets/configurator-items/background-color-rules-configuration/background-color-rules-configuration.component";
import { DataSourceConfigurationComponent } from "../../configurator/components/widgets/configurator-items/data-source-configuration/data-source-configuration.component";
import { KpiDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/kpi-description-configuration/kpi-description-configuration.component";
import { ThresholdsConfigurationComponent } from "../../configurator/components/widgets/configurator-items/thresholds-configuration/thresholds-configuration.component";
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { KpiTilesConfigurationComponent } from "../../configurator/components/widgets/kpi/kpi-tiles-configuration/kpi-tiles-configuration.component";
import { DEFAULT_KPI_BACKGROUND_COLORS } from "../../constants/default-palette";
import { DEFAULT_PIZZAGNA_ROOT, NOVA_KPI_SECTION_CONVERTER, NOVA_KPI_TILES_CONVERTER, NOVA_TITLE_AND_DESCRIPTION_CONVERTER } from "../../services/types";
import { IProviderConfiguration, PizzagnaLayer, WellKnownProviders } from "../../types";
import { REFRESHER_CONFIGURATOR } from "../common/configurator/components";
// tslint:enable:max-line-length

export const kpiConfigurator = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the configurator - all form components referenced herein will be stacked in a column
            componentType: FormStackComponent.lateLoadKey,
            properties: {
                elementClass: "flex-grow-1 overflow-auto nui-scroll-shadows",
                // references to other components laid out in this form
                nodes: [
                    "presentation",
                    "tiles",
                ],
            },
        },
        // /presentation
        presentation: {
            id: "presentation",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Presentation`,
                nodes: ["titleAndDescription", "refresher"],
            },
        },
        // /presentation/titleAndDescription
        titleAndDescription: {
            id: "titleAndDescription",
            componentType: TitleAndDescriptionConfigurationComponent.lateLoadKey,
            providers: {
                converter: {
                    providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                },
            },
        },
        refresher: REFRESHER_CONFIGURATOR,
        // /tiles
        tiles: {
            id: "tiles",
            componentType: KpiTilesConfigurationComponent.lateLoadKey,
            properties: {
                // these components serve as a template for every KPI tile created
                template: [
                    {
                        // KPI tile description (label, color, etc.) configuration section
                        id: "description",
                        componentType: KpiDescriptionConfigurationComponent.lateLoadKey,
                        properties: {
                            configurableUnits: true,
                            backgroundColors: [...DEFAULT_KPI_BACKGROUND_COLORS],
                        },
                        providers: {
                            // converter transforms the data between the widget and the form
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_KPI_SECTION_CONVERTER,
                                properties: {
                                    formParts: [
                                        {
                                            previewPath: "properties.widgetData",
                                            keys: ["label", "backgroundColor", "units"],
                                        },
                                    ],
                                },
                            } as IProviderConfiguration,
                        },
                    },
                    {
                        // data source configuration section
                        id: "dataSource",
                        componentType: DataSourceConfigurationComponent.lateLoadKey,
                        properties: {
                            // for the DataSourceConfigurationComponent, this defines the list of data sources to pick from
                            dataSourceProviders: [] as string[],
                        },
                        providers: {
                            // converter transforms the data source metadata between the widget and the form
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_KPI_SECTION_CONVERTER,
                                properties: {
                                    formParts: [
                                        {
                                            // this component updates 'providerId' of 'dataSource'
                                            previewPath: "providers.dataSource",
                                            // TODO: Remove 'properties' key in v10
                                            keys: ["providerId", "properties"],
                                        },
                                        {
                                            // this component updates 'properties' of 'dataSource' via an adapter
                                            previewPath: "providers.adapter.properties.dataSource",
                                            keys: ["properties"],
                                        },
                                    ],
                                },
                            } as IProviderConfiguration,
                        },
                    },
                    {
                        // thresholds configuration section
                        id: "thresholds",
                        componentType: ThresholdsConfigurationComponent.lateLoadKey,
                        providers: {
                            // converter transforms the data between the widget and the form
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_KPI_SECTION_CONVERTER,
                                properties: {
                                    formParts: [
                                        {
                                            // this component updates `thresholds` properties of `adapter`
                                            previewPath: "providers.adapter.properties.thresholds",
                                            keys: [
                                                "criticalThresholdValue",
                                                "warningThresholdValue",
                                                "showThresholds",
                                                "reversedThresholds",
                                            ],
                                        },
                                    ],
                                },
                            } as IProviderConfiguration,
                        },
                    },
                    {
                        id: "backgroundColorRules",
                        componentType: BackgroundColorRulesConfigurationComponent.lateLoadKey,
                        properties: {
                            backgroundColors: [...DEFAULT_KPI_BACKGROUND_COLORS],
                        },
                        providers: {
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_KPI_SECTION_CONVERTER,
                                properties: {
                                    formParts: [
                                        {
                                            previewPath: "providers.kpiColorPrioritizer.properties",
                                            keys: [ "rules" ],
                                        },
                                    ],
                                },
                            } as IProviderConfiguration,
                        },
                    },
                ],
            },
            providers: {
                // converter transforms the data between the widget and the form
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_KPI_TILES_CONVERTER,
                } as IProviderConfiguration,
            },
        },
    },
};