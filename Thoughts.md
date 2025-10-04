# ECS

- entities are just Objects.
- components contain the data for these objects
- systems add logic

- Entities could be 'dumb' and could be just an ID with some components
  - I don't think it's needed to add specific functionality for a minerEntity or an oreEntity. This data will be added by adding components to an Entity.

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
