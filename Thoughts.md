# ECS

- entities are just Objects.
- components contain the data for these objects
- systems add logic

- Entities are 'dumb' and are nothing more than an ID, with a number of components

- There has to be a registry of entities that could be filtered on 1 or more components. This has to be fast since there could be 1000s of components.
  - is the current HasComponent fast enough? Or should we create a separate collections per component?
    - How to search for multiple then? Or pick the first and then filter the rest?

## Transporter Thoughts

Transporter are implemented as belts or pipes, but can even be trucks or people moving stuff. As long as they take items from A to B.

They need to be connected and processed from then end to the beginning so they can all be updated moving their items in 1 tick if possible. This would allow things like pipes being instant from inventory to inventory.

Transporters know about what transporter they are connected to and Transporter is connected to them. I think an extra component at the first (importer) and at the last (exporter) transporter can be used to connect them to other inventories.

This means a transporter is a pretty standard double linked list. By using a double linked list it's easy to update the entire length of the belt.

We can just check if the 'next' in the list is null. If it is null it is the front one. Would it be fast enough to filter all transporters for each one where 'next' is null? If the transported/belt system would start the updating from these and work backwards through all 'prev' references all belts should be updated in order.

If an entity is placed on or deleted from the map (or moved?) the neigboring entities are notified. They can update there prev and next references accordingly. Automatically correcting the start of each update chain.

To make this visible we can have entities that have an import or export component that can take something from an external inventory and put in on a transporter or insert it into an inventory.

To merge and split we need can add merger or splitter components. Or have more specialized version of the transporter with this functionality build in. A separate 'building' would be easiest for now. 1 in 3 out or 3 in 1 out. To have a transporter connect to something.

Who decides if something can connect? Does a target allow something to connect to it or does the source require a specific component to connect to? Or maybe just any of them depending on the case. Let's take an importer. The importer connects an inventory to a transporter. So, the importer knows what an inventory is and what a transporter is. Do we introduce a 'ConnectableComponent'?

## Animations

How will animations be handled? Basically, all animations show some sort of progress. Whether it's a delay before an item is mined, or an item moves across a belt. These animations need to be as smooth as possible and run on the normal update cycle. A normal system would not cut it, because that runs on the TPS and not on the normal cycle. Also, the animations can be skipped if the distance is too big or when things are outside of the the frustrum or something, but the machines need to produce always.

What about 2 types of systems? TPS bound systems and Frame update bound systems? There can be different filters for the frame bound ones. Some only need to run when the UI of a machine is open maybe? Also, the view distance or something can be of influence.

For the frame update bound system, that has to have some reference to a Wonderland component so that it can update a position or such. This connection could be set up when the entity is created?

## Building definitions

Some buildings have an input and/or an output. Buildings have a size that is bigger than 1 tile. Somehow the tile and direction of these inputs/outputs have to be described. Does this have to be done in the BuildingMeta? Or somewhere else?

### in the case of a miner

Is the produced item placed in the output slot or an inventory? Or are input and output slots basically some sort of inventory?
