import { AltToEnterContainerExtensionProvider, ApplyFirstMachingExtensionProvider, BaseCustomWebComponentPropertiesService, ButtonSeperatorProvider, CanvasExtensionProvider, ChildContextMenu, ConditionExtensionProvider, ContentService, CopyPasteContextMenu, CopyPasteService, DefaultEditorTypesService, DefaultHtmlParserService, DefaultInstanceService, DefaultModelCommandService, DefaultPlacementService, DesignItemDocumentPositionService, DisplayGridExtensionProvider, DragDropService, DrawElementTool, DrawEllipsisTool, DrawLineTool, DrawPathTool, DrawRectTool, DrawToolButtonProvider, EditTextExtensionProvider, ElementAtPointService, ElementDragTitleExtensionProvider, EventsService, ExtensionType, ExternalDragDropService, FlexBoxPlacementService, FlexboxExtensionDesignViewConfigButtons, FlexboxExtensionProvider, GrayOutDragOverContainerExtensionProvider, GrayOutExtensionProvider, GridExtensionDesignViewConfigButtons, GridPlacementService, HighlightElementExtensionProvider, HtmlWriterService, IDesignerCanvas, InvisibleElementExtensionDesignViewConfigButtons, InvisibleElementExtensionProvider, ItemsBelowContextMenu, JumpToElementContextMenu, LitElementPropertiesService, MagicWandSelectorTool, MathMLElementsPropertiesService, MultipleItemsSelectedContextMenu, MultipleSelectionRectExtensionProvider, NamedTools, NativeElementsPropertiesService, PanTool, PathContextMenu, PickColorTool, PlacementExtensionProvider, PointerTool, PointerToolButtonProvider, PolymerPropertiesService, PositionExtensionProvider, PropertyGroupsService, RectContextMenu, RectangleSelectorTool, ResizeExtensionProvider, RotateLeftAndRight, RoundPixelsDesignViewConfigButton, SVGElementsPropertiesService, SelectAllChildrenContextMenu, SelectionDefaultExtensionProvider, SelectionService, SelectorToolButtonProvider, SeperatorContextMenu, SeperatorToolProvider, ServiceContainer, SimpleDemoProviderService, SnaplinesProviderService, StylesheetServiceDesignViewConfigButtons, SvgElementExtensionProvider, TextTool, TextToolButtonProvider, ToolbarExtensionsDesignViewConfigButtons, TransformOriginExtensionProvider, TransformToolButtonProvider, UndoService, ZMoveContextMenu, ZoomToElementContextMenu, ZoomTool, ZoomToolButtonProvider } from "@node-projects/web-component-designer";

export function createDefaultServiceContainer() {
  let serviceContainer = new ServiceContainer();

  let defaultPlacementService = new DefaultPlacementService();
  serviceContainer.register("containerService", defaultPlacementService);
  serviceContainer.register("containerService", new GridPlacementService(defaultPlacementService));
  serviceContainer.register("containerService", new FlexBoxPlacementService(defaultPlacementService));

  serviceContainer.register("propertyService", new PolymerPropertiesService());
  serviceContainer.register("propertyService", new LitElementPropertiesService());
  serviceContainer.register("propertyService", new NativeElementsPropertiesService());
  serviceContainer.register("propertyService", new SVGElementsPropertiesService());
  serviceContainer.register("propertyService", new MathMLElementsPropertiesService());
  serviceContainer.register("propertyService", new BaseCustomWebComponentPropertiesService());
  serviceContainer.register("propertyGroupsService", new PropertyGroupsService());
  serviceContainer.register("instanceService", new DefaultInstanceService());
  serviceContainer.register("editorTypesService", new DefaultEditorTypesService());
  serviceContainer.register("htmlWriterService", new HtmlWriterService());
  serviceContainer.register("snaplinesProviderService", new SnaplinesProviderService());
  serviceContainer.register("htmlParserService", new DefaultHtmlParserService());
  serviceContainer.register("elementAtPointService", new ElementAtPointService());
  serviceContainer.register("externalDragDropService", new ExternalDragDropService());
  serviceContainer.register("dragDropService", new DragDropService());
  serviceContainer.register("copyPasteService", new CopyPasteService());
  serviceContainer.register("modelCommandService", new DefaultModelCommandService());
  serviceContainer.register("demoProviderService", new SimpleDemoProviderService());
  serviceContainer.register("eventsService", new EventsService());

  serviceContainer.register("undoService", (designerCanvas: IDesignerCanvas) => new UndoService(designerCanvas));
  serviceContainer.register("selectionService", (designerCanvas: IDesignerCanvas) => new SelectionService(designerCanvas, false));
  serviceContainer.register("contentService", (designerCanvas: IDesignerCanvas) => new ContentService(designerCanvas.rootDesignItem));
  serviceContainer.register("designItemDocumentPositionService", (designerCanvas: IDesignerCanvas) => new DesignItemDocumentPositionService(designerCanvas));

  serviceContainer.designerExtensions.set(ExtensionType.Permanent, [
    new InvisibleElementExtensionProvider(),
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.PrimarySelection, [
    new ConditionExtensionProvider(new ElementDragTitleExtensionProvider(), item => !(item.node instanceof SVGElement) || item.node instanceof SVGSVGElement),
    new TransformOriginExtensionProvider(true),
    new CanvasExtensionProvider(),
    new PositionExtensionProvider(),
    new SvgElementExtensionProvider(),
    new ResizeExtensionProvider(true),
    new ConditionExtensionProvider(new MultipleSelectionRectExtensionProvider(), item => !(item.node instanceof SVGElement) || item.node instanceof SVGSVGElement),
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.PrimarySelectionAndCanBeEntered, [
    new DisplayGridExtensionProvider(),
    new FlexboxExtensionProvider(),
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.Selection, [
    new ConditionExtensionProvider(new SelectionDefaultExtensionProvider(), item => !(item.node instanceof SVGElement) || item.node instanceof SVGSVGElement),
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.PrimarySelectionContainerAndCanBeEntered, [
    new DisplayGridExtensionProvider('lightgray', '#8080802b'),
    new FlexboxExtensionProvider()
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.MouseOver, [
    new HighlightElementExtensionProvider()
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.Placement, [
    new PlacementExtensionProvider()
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.ContainerDrag, [
    new GrayOutExtensionProvider()
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.ContainerDragOverAndCanBeEntered, [
    new ApplyFirstMachingExtensionProvider(
      new DisplayGridExtensionProvider(),
      new GrayOutDragOverContainerExtensionProvider(),
    ),
    new AltToEnterContainerExtensionProvider()
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.ContainerExternalDragOverAndCanBeEntered, [
    new ApplyFirstMachingExtensionProvider(
      new DisplayGridExtensionProvider(),
      new GrayOutDragOverContainerExtensionProvider(),
    ),
  ]);
  serviceContainer.designerExtensions.set(ExtensionType.Doubleclick, [
    new EditTextExtensionProvider()
  ]);

  serviceContainer.designerTools.set(NamedTools.Pointer, new PointerTool());
  serviceContainer.designerTools.set(NamedTools.DrawSelection, new RectangleSelectorTool());
  serviceContainer.designerTools.set(NamedTools.DrawPath, new DrawPathTool());
  serviceContainer.designerTools.set(NamedTools.DrawRect, new DrawRectTool());
  serviceContainer.designerTools.set(NamedTools.DrawEllipsis, new DrawEllipsisTool());
  serviceContainer.designerTools.set(NamedTools.DrawLine, new DrawLineTool());
  serviceContainer.designerTools.set(NamedTools.Zoom, new ZoomTool());
  serviceContainer.designerTools.set(NamedTools.Pan, new PanTool());
  serviceContainer.designerTools.set(NamedTools.RectangleSelector, new RectangleSelectorTool());
  serviceContainer.designerTools.set(NamedTools.MagicWandSelector, new MagicWandSelectorTool());
  serviceContainer.designerTools.set(NamedTools.PickColor, new PickColorTool());
  serviceContainer.designerTools.set(NamedTools.Text, new TextTool());
  serviceContainer.designerTools.set(NamedTools.DrawElementTool, DrawElementTool);

  serviceContainer.designViewConfigButtons.push(
    new ButtonSeperatorProvider(20),
    new GridExtensionDesignViewConfigButtons(),
    new FlexboxExtensionDesignViewConfigButtons(),
    new ButtonSeperatorProvider(10),
    new InvisibleElementExtensionDesignViewConfigButtons(),
    new ButtonSeperatorProvider(10),
    new StylesheetServiceDesignViewConfigButtons(),
    new ButtonSeperatorProvider(10),
    new ToolbarExtensionsDesignViewConfigButtons(),
    new ButtonSeperatorProvider(30),
    new RoundPixelsDesignViewConfigButton()
  );

  serviceContainer.designViewToolbarButtons.push(
    new PointerToolButtonProvider(),
    new SeperatorToolProvider(22),
    new SelectorToolButtonProvider(),
    new SeperatorToolProvider(22),
    new ZoomToolButtonProvider(),
    new SeperatorToolProvider(22),
    new DrawToolButtonProvider(),
    new SeperatorToolProvider(22),
    new TextToolButtonProvider(),
    new SeperatorToolProvider(22),
    new TransformToolButtonProvider()
  );

  serviceContainer.designerContextMenuExtensions = [
    new ChildContextMenu('edit', new CopyPasteContextMenu()),
    new SeperatorContextMenu(),
    new ChildContextMenu('modify', new RotateLeftAndRight(), new SeperatorContextMenu(), new ZMoveContextMenu()),
    new SeperatorContextMenu(),
    new ChildContextMenu('view', new JumpToElementContextMenu(), new ZoomToElementContextMenu()),
    new SeperatorContextMenu(),
    new MultipleItemsSelectedContextMenu(),
    new PathContextMenu(),
    new RectContextMenu(),
    new SeperatorContextMenu(),
    new SelectAllChildrenContextMenu(),
    new SeperatorContextMenu(),
    new ItemsBelowContextMenu(),
  ];

  return serviceContainer;
}

export default createDefaultServiceContainer;