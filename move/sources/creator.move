module notic3::creator {
    use std::string::{String};
    use sui::vec_map::{Self, VecMap};

    public struct CreatorRegistry has key {
        id: UID,
        creators: VecMap<address, Creator>
    }

    public struct Creator has store {
        name: String,
        id: vector<u8>
    }

    fun init(ctx: &mut TxContext) {
        let registry = CreatorRegistry {
            id: object::new(ctx),
            creators: vec_map::empty(),
        };
        transfer::share_object(registry);
    }

    public entry fun register_creator(
        registry: &mut CreatorRegistry,
        name: String,
        id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let creator_address = tx_context::sender(ctx);
        let creator = Creator { name, id };
        vec_map::insert(&mut registry.creators, creator_address, creator);
    }

    public fun get_creator(registry: &CreatorRegistry, addr: &address): &Creator {
        vec_map::get(&registry.creators, addr)
    }

    public fun get_all_creators(registry: &CreatorRegistry): &VecMap<address, Creator> {
        &registry.creators
    }
}