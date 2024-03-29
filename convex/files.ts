import { ConvexError, v } from 'convex/values'
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from './_generated/server'
import { getUser } from './users'
import { fileTypes } from './schema';
import { Doc, Id } from './_generated/dataModel';

export const generateUploadUrl = mutation(async (ctx) => {
    const idenity = await ctx.auth.getUserIdentity()
    if (!idenity) throw new ConvexError("You must be logged in to upload/create a file")
    return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, orgId: string) {
    const idenity = await ctx.auth.getUserIdentity()
    if (!idenity) return null

    const user = await getUser(ctx, idenity.tokenIdentifier)

    const hasAccess = user.orgIds.some(item => item.orgId === orgId) || user.tokenIdentifier.includes(orgId)
    if (!hasAccess) return null

    return { user }
}

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        type: fileTypes
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        if (!hasAccess) throw new ConvexError('you do not have access to this org')

        await ctx.db.insert('files', {
            name: args.name,
            type: args.type,
            fileId: args.fileId,
            orgId: args.orgId,
            userId: hasAccess.user._id
        })
    }
})

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
        deleted: v.optional(v.boolean()),
        type: v.optional(fileTypes),
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        if (!hasAccess) return []

        const { user } = hasAccess

        const allFiles = await ctx.db
            .query("files")
            .withIndex("by_orgId", q => q.eq('orgId', args.orgId))
            .collect()

        const query = args.query
        let filesSelected = query ? allFiles.filter(file => file.name.toLowerCase().includes(query.toLowerCase())) : allFiles

        if (args.favorites) {
            const favorites = await ctx.db
                .query("favorites")
                .withIndex("by_userId_orgId_fileId", q => q
                    .eq("userId", user?._id)
                    .eq("orgId", args.orgId)
                ).collect()

            // if it's very slow I must refactor these type of filter systems 
            filesSelected = filesSelected.filter((file) => !file.forDeleted).filter((file) =>
                favorites.some(
                    (favorite) => (favorite.fileId === file._id)
                )
            )
        }

        if (args.deleted) {
            // if it's very slow I must refactor these type of filter systems 
            filesSelected = filesSelected.filter((file) => file.forDeleted)
        } else {
            filesSelected = filesSelected.filter((file) => !file.forDeleted)
        }

        if (args.type) {
            // if it's very slow I must refactor these type of filter systems 
            return filesSelected.filter((file) => file.type === args.type)
        }

        return filesSelected
    }
})

export const deleteFile = mutation({
    args: { fileId: v.id('files') },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId)
        if (!access) throw new ConvexError("no access to file")

        assertCanDeleteFile(access.user, access.file)

        // await ctx.db.delete(args.fileId)
        await ctx.db.patch(args.fileId, {
            forDeleted: true
        })
    }
})

export const deleteFilePermanently = mutation({
    args: { fileId: v.id('files'), fileIdStorage: v.id("_storage") },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId)
        if (!access) throw new ConvexError("no access to file")

        assertCanDeleteFile(access.user, access.file)

        const file = await ctx.db
            .query("files")
            .withIndex("by_fileId",
                q => q
                    .eq("fileId", args.fileIdStorage)
            )
            .first()

        if (!file) throw new ConvexError(`No such file`)

        await ctx.storage.delete(file.fileId)
        await ctx.db.delete(file._id)
    }
})

// before implementing this functionaliyy I must know how to proctect it by users
// export const clearTrash = mutation({
//     args: {},
//     async handler(ctx) {
//         const files = await ctx.db.query("files")
//             .withIndex("by_forDeleted", q => q.eq("forDeleted", true))
//             .collect()

//         await Promise.all(
//             files.map(async (file) => {
//                 await ctx.storage.delete(file.fileId)
//                 return await ctx.db.delete(file._id)
//             })
//         )
//     }
// })

export const clearTrashCron = internalMutation({
    args: {},
    async handler(ctx) {
        const files = await ctx.db.query("files")
            .withIndex("by_forDeleted", q => q.eq("forDeleted", true))
            .collect()

        await Promise.all(
            files.map(async (file) => {
                await ctx.storage.delete(file.fileId)
                return await ctx.db.delete(file._id)
            })
        )
    }
})

export const restoreFile = mutation({
    args: { fileId: v.id('files') },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId)
        if (!access) throw new ConvexError("no access to file")

        assertCanDeleteFile(access.user, access.file)

        // await ctx.db.delete(args.fileId)
        await ctx.db.patch(args.fileId, {
            forDeleted: false
        })
    }
})

export const toogleFavorite = mutation({
    args: { fileId: v.id('files') },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId)
        if (!access) throw new ConvexError("no access to file")
        const { user, file } = access

        const favorite = await ctx.db
            .query("favorites")
            .withIndex("by_userId_orgId_fileId",
                q => q
                    .eq("userId", user._id)
                    .eq("orgId", file.orgId)
                    .eq("fileId", file._id)
            )
            .first()

        if (!favorite) {
            await ctx.db.insert("favorites", {
                fileId: file._id,
                userId: user._id,
                orgId: file.orgId,
            })
        } else {
            await ctx.db.delete(favorite._id)
        }
    }
})

export const getAllFavorites = query({
    args: { orgId: v.string() },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        if (!hasAccess) return null

        const { user } = hasAccess

        return await ctx.db
            .query("favorites")
            .withIndex("by_userId_orgId_fileId",
                q => q
                    .eq("userId", user._id)
                    .eq("orgId", args.orgId)
            )
            .collect()


    }
})

export const getAllDeleted = query({
    args: { orgId: v.string() },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        if (!hasAccess) return null

        const { user } = hasAccess

        return await ctx.db
            .query("favorites")
            .withIndex("by_userId_orgId_fileId",
                q => q
                    .eq("userId", user._id)
                    .eq("orgId", args.orgId)
            )
            .collect()


    }
})

async function assertCanDeleteFile(user: Doc<"users">, file: Doc<"files">) {
    const canDelete = file.userId === user._id || user.orgIds.find(org => org.orgId === file.orgId)?.role === "admin"
    if (!canDelete) throw new ConvexError("you have no access to delete or restore file")
    return canDelete
}

async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">) {
    const file = await ctx.db.get(fileId)
    if (!file) return null

    const hasAccess = await hasAccessToOrg(ctx, file.orgId)
    if (!hasAccess) return null

    const { user } = hasAccess

    return { user, file }
}